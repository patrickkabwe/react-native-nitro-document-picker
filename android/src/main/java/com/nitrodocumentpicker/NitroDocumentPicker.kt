package com.nitrodocumentpicker

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.provider.DocumentsContract
import android.provider.OpenableColumns
import android.util.Base64
import android.util.Base64OutputStream
import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.net.toUri
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerOptions
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerResult
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentType
import kotlinx.coroutines.CancellableContinuation
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import java.io.ByteArrayOutputStream
import java.util.concurrent.CancellationException
import kotlin.coroutines.resume

class NitroDocumentPicker(
    private val context: ReactApplicationContext
) : LifecycleEventListener {

    private var pickerContinuation: CancellableContinuation<Array<NitroDocumentPickerResult>>? = null
    private var launcher: ActivityResultLauncher<Intent>? = null

    init {
        context.addLifecycleEventListener(this)
    }

    suspend fun pick(options: NitroDocumentPickerOptions): Array<NitroDocumentPickerResult> =
        suspendCancellableCoroutine { continuation ->
            pickerContinuation = continuation
            continuation.invokeOnCancellation {
                pickerContinuation = null
            }

            val mimeTypes = getMimeTypes(options.types)
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = if (mimeTypes.isNotEmpty()) mimeTypes[0] else "*/*"
                if (mimeTypes.size > 1) {
                    putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes.toTypedArray())
                }
                putExtra(Intent.EXTRA_ALLOW_MULTIPLE, options.multiple == true)
                putExtra(Intent.EXTRA_LOCAL_ONLY, true)
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    putExtra(DocumentsContract.EXTRA_INITIAL_URI, getInitialUri())
                }
            }

            launcher?.launch(intent)
        }

    private fun getInitialUri(): Uri? {
        val externalFilesDir = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS)
        return externalFilesDir?.toUri()
    }

    private fun handlePickerResult(resultCode: Int, data: Intent?) {
        if (resultCode == Activity.RESULT_OK && data != null) {
            val results = mutableListOf<NitroDocumentPickerResult>()

            data.clipData?.let { clipData ->
                for (i in 0 until clipData.itemCount) {
                    val uri = clipData.getItemAt(i).uri
                    results.add(resolveUriToResult(uri))
                }
            } ?: data.data?.let { uri ->
                results.add(resolveUriToResult(uri))
            }

            if (pickerContinuation?.isActive == true) {
                pickerContinuation?.resume(results.toTypedArray())
            }
        } else {
            pickerContinuation?.cancel(CancellationException("User cancelled picker"))
        }
        pickerContinuation = null
    }

    override fun onHostResume() {
        val activity = context.currentActivity
        if (launcher == null && activity is ComponentActivity) {
            launcher = activity.activityResultRegistry.register(
                ACTIVITY_RESULT_KEY, ActivityResultContracts.StartActivityForResult()
            ) { result ->
                CoroutineScope(Dispatchers.Main).launch {
                    handlePickerResult(result.resultCode, result.data)
                }
            }
        }
    }

    override fun onHostPause() {}

    override fun onHostDestroy() {
        launcher?.unregister()
        launcher = null
    }

    private fun resolveUriToResult(uri: Uri): NitroDocumentPickerResult {
        val resolver = context.contentResolver
        var name = "unknown"
        var size = 0
        var mimeType: String? = null

        resolver.query(uri, null, null, null, null)?.use { cursor ->
            val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
            if (cursor.moveToFirst()) {
                name = cursor.getString(nameIndex)
                size = cursor.getInt(sizeIndex)
            }
        }

        resolver.getType(uri)?.let {
            mimeType = it
        }

        val output = ByteArrayOutputStream()
        Base64OutputStream(output, Base64.DEFAULT).use { base64Stream ->
            resolver.openInputStream(uri)?.use { input ->
                val buffer = ByteArray(50 * 1024 * 1024)
                var bytesRead: Int
                while (input.read(buffer).also { bytesRead = it } != -1) {
                    base64Stream.write(buffer, 0, bytesRead)
                }
            }
        }

        val base64String = output.toString()

        return NitroDocumentPickerResult(
            path = uri.toString(),
            base64 = base64String,
            name = name
        )
    }


    private fun getMimeTypes(types: Array<NitroDocumentType>): List<String> = types.map {
        when (it) {
            NitroDocumentType.PDF -> "application/pdf"
            NitroDocumentType.DOCX -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            NitroDocumentType.XLSX -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            NitroDocumentType.PPTX -> "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            NitroDocumentType.TXT -> "text/plain"
            NitroDocumentType.CSV -> "text/comma-separated-values"
        }
    }

    companion object {
        const val TAG = "NitroDocumentPicker"
        const val ACTIVITY_RESULT_KEY = "nitro-document-picker-result"
    }
}