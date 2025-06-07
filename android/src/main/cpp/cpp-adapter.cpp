#include <jni.h>
#include "NitroDocumentPickerOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitrodocumentpicker::initialize(vm);
}
