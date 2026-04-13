#include "nan.h"
#include "../../src/tree_sitter/parser.h"

using namespace v8;

extern "C" TSLanguage * tree_sitter_arche();

namespace {

NAN_METHOD(New) {}

void Init(Local<Object> exports, Local<Object> module, Local<Context> context) {
  Local<Object> lang = Nan::New<Object>();
  Nan::Set(lang, Nan::New("id").ToLocalChecked(),
           Nan::New<External>(tree_sitter_arche()));
  Nan::Set(exports, Nan::New("LANGUAGE").ToLocalChecked(), lang);
}

NODE_MODULE(tree_sitter_arche_binding, Init)

}  // namespace
