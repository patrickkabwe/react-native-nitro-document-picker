package com.nitrodocumentpicker

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.provider.DocumentsContract
import android.provider.OpenableColumns
import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.net.toUri
import androidx.lifecycle.lifecycleScope
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerOptions
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerResult
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentType
import kotlinx.coroutines.CancellableContinuation
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import java.util.concurrent.CancellationException
import kotlin.coroutines.resume
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope

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

            // Handle types array
            val types = options.types
            if (types.isEmpty()) {
                continuation.cancel(CancellationException("No document types specified. Provide types array with at least one type or use 'all' for all types."))
                return@suspendCancellableCoroutine
            }
            
            // Check if 'all' is in the types array
            val mimeTypes = if (types.any { it.stringValue == "all" }) {
                listOf("*/*")
            } else {
                getMimeTypes(types)
            }
            
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = if (mimeTypes.isNotEmpty()) mimeTypes[0] else "*/*"
                if (mimeTypes.size > 1) {
                    putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes.toTypedArray())
                }
                putExtra(Intent.EXTRA_ALLOW_MULTIPLE, options.multiple == true)
                putExtra(Intent.EXTRA_LOCAL_ONLY, options.localOnly == true)
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

    private suspend fun handlePickerResult(resultCode: Int, data: Intent?) {
        if (resultCode == Activity.RESULT_OK && data != null) {
            val uris = mutableListOf<Uri>()

            data.clipData?.let { clipData ->
                for (i in 0 until clipData.itemCount) {
                    uris.add(clipData.getItemAt(i).uri)
                }
            } ?: data.data?.let { uri ->
                uris.add(uri)
            }
            
            val results: List<NitroDocumentPickerResult> = if (uris.size <= 3) {
                uris.map { uri -> resolveUriToResult(uri) }
            } else {
                coroutineScope {
                    uris.map { uri ->
                        async(Dispatchers.IO) {
                            resolveUriToResult(uri)
                        }
                    }.awaitAll()
                }
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
                activity.lifecycleScope.launch(context = Dispatchers.Main) {
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
        val contentResolver = context.contentResolver
        val projection = arrayOf(
            OpenableColumns.DISPLAY_NAME,
            OpenableColumns.SIZE
        )

        val (fileName, sizeFromCursor) = contentResolver.query(uri, projection, null, null, null)?.use { cursor ->
            val fileNameIdx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            val sizeIdx = cursor.getColumnIndex(OpenableColumns.SIZE)
            cursor.moveToFirst()
            cursor.getString(fileNameIdx) to cursor.getLong(sizeIdx)
        } ?: ("unknown" to -1L)

        return NitroDocumentPickerResult(
            uri = uri.toString(),
            name = fileName,
            mimeType = contentResolver.getType(uri) ?: "",
            size = sizeFromCursor.toDouble()
        )
    }


    private fun getMimeTypes(types: Array<NitroDocumentType>): List<String> = types.map {
        when (it) {
            // Existing document types
            NitroDocumentType.PDF -> "application/pdf"
            NitroDocumentType.DOCX -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            NitroDocumentType.XLSX -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            NitroDocumentType.PPTX -> "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            NitroDocumentType.TXT -> "text/plain"
            NitroDocumentType.CSV -> "text/comma-separated-values"
            // Image types
            NitroDocumentType.JPG, NitroDocumentType.JPEG -> "image/jpeg"
            NitroDocumentType.PNG -> "image/png"
            NitroDocumentType.GIF -> "image/gif"
            NitroDocumentType.WEBP -> "image/webp"
            // Video types
            NitroDocumentType.MP4 -> "video/mp4"
            NitroDocumentType.MOV -> "video/quicktime"
            NitroDocumentType.AVI -> "video/x-msvideo"
            NitroDocumentType.MKV -> "video/x-matroska"
            NitroDocumentType.WEBM -> "video/webm"
            // Audio types
            NitroDocumentType.MP3 -> "audio/mpeg"
            NitroDocumentType.WAV -> "audio/wav"
            // Rich Text/Markup
            NitroDocumentType.RTF -> "application/rtf"
            NitroDocumentType.HTML -> "text/html"
            NitroDocumentType.XML -> "application/xml"
            NitroDocumentType.MD, NitroDocumentType.MARKDOWN -> "text/markdown"
            // Archives
            NitroDocumentType.ZIP -> "application/zip"
            // Code files
            NitroDocumentType.JS, NitroDocumentType.JAVASCRIPT -> "application/javascript"
            NitroDocumentType.TS, NitroDocumentType.TYPESCRIPT -> "application/typescript"
            NitroDocumentType.JSON -> "application/json"
            NitroDocumentType.CSS -> "text/css"
            NitroDocumentType.PY -> "text/x-python"
            NitroDocumentType.CPP, NitroDocumentType.C -> "text/x-c++src"
            NitroDocumentType.SWIFT -> "text/x-swift"
            NitroDocumentType.KT, NitroDocumentType.KOTLIN -> "text/x-kotlin"
            // E-books
            NitroDocumentType.EPUB -> "application/epub+zip"
            // Fonts
            NitroDocumentType.TTF -> "font/ttf"
            NitroDocumentType.OTF -> "font/otf"
            // Databases
            NitroDocumentType.DB, NitroDocumentType.SQLITE -> "application/x-sqlite3"
            // Config files
            NitroDocumentType.YAML, NitroDocumentType.YML -> "application/x-yaml"
            // CAD/Design
            NitroDocumentType.SVG -> "image/svg+xml"
            else -> throw Error("Unsupported document type: $it")
        }
    }

    companion object {
        const val TAG = "NitroDocumentPicker"
        const val ACTIVITY_RESULT_KEY = "nitro-document-picker-result"
    }
}
