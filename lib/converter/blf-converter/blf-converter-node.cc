//	converter_node.cc
//
//	~~~~~~~~~~~~~~~~~~
//
//	This is the interface moudle to ZD controller (node.js based)
//  The function of this moudle is to move and translate data between PCAN moudle and ZD controller,
//  i.e. moving the Objects/Data back and forth between C/C++ moudle and Javascript moudle.
//
//  CAUTION: !!!Java Sematics!!!, instances of a Class shall be initialized by "new" operator and access the member function/variable by "->" operator
//  e.g.
//      Local<Object> obj   = Object::New(isolate);
//      obj->Set(String::NewFromUtf8(isolate, "ID"), Integer::NewFromUnsigned(isolate, (unsigned int)msg.ID));
//
//	~~~~~~~~~~~~~~~~~~
//
//	----------------------------------------------------------------
//	Author: Bian, Jiang
//	Created: 22.03.2017
//
//	Language: C/C++
//	----------------------------------------------------------------
//
//	Copyright (C)  		ZD Automotive GmbH, Ingolstadt
//	more Info

#include <node.h>

using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

#include "blf-converter.h"

Vector::BLF::ObjectType getModule(const std::string &moduleStr)
{
    if (moduleStr.compare("CAN") == 0)
        return Vector::BLF::ObjectType::CAN_MESSAGE;
    else if (moduleStr.compare("LIN") == 0)
        return Vector::BLF::ObjectType::LIN_MESSAGE;
    else if (moduleStr.compare("CANFD") == 0)
        return Vector::BLF::ObjectType::CAN_FD_MESSAGE;
    else if (moduleStr.compare("CANFD64") == 0)
        return Vector::BLF::ObjectType::CAN_FD_MESSAGE_64;
    else
        return Vector::BLF::ObjectType::UNKNOWN;
}

void NODE_CONVERT_BLF_read(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    v8::Isolate *isolate = args.GetIsolate();

    v8::String::Utf8Value moduleStr(v8::Local<v8::Value>::Cast(args[0]));
    v8::String::Utf8Value blf_filepath(v8::Local<v8::Value>::Cast(args[1]));
    v8::Local<Function> cb = v8::Local<Function>::Cast(args[2]);

    Vector::BLF::ObjectType module = getModule(std::string(*moduleStr));
    if (module == Vector::BLF::ObjectType::UNKNOWN)
    {
        std::string res("unrecognized MODULE type");
        v8::Local<Value> ret[] = {v8::String::NewFromUtf8(isolate, res.c_str()), v8::Null(isolate)};
        cb->Call(v8::Null(isolate), 2, ret);
        return;
    }

    json records;
    if (BLF_read(module, std::string(*blf_filepath).c_str(), records) > 0)
    {
        v8::Local<Value> ret[] = {v8::Null(isolate), v8::String::NewFromUtf8(isolate, records.dump().c_str())};
        cb->Call(v8::Null(isolate), 2, ret);
    }
    else
    {
        std::string res("unable to read");
        v8::Local<Value> ret[] = {v8::String::NewFromUtf8(isolate, res.c_str()), v8::Null(isolate)};
        cb->Call(v8::Null(isolate), 2, ret);
    }
}

void NODE_CONVERT_BLF_write(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    v8::Isolate *isolate = args.GetIsolate();

    v8::String::Utf8Value moduleStr(v8::Local<v8::Value>::Cast(args[0]));
    v8::String::Utf8Value blf_filepath(v8::Local<v8::Value>::Cast(args[1]));
    v8::String::Utf8Value blf_records(v8::Local<v8::Value>::Cast(args[2]));
    v8::Local<Function> cb = v8::Local<Function>::Cast(args[3]);

    Vector::BLF::ObjectType module = getModule(std::string(*moduleStr));
    if (module == Vector::BLF::ObjectType::UNKNOWN)
    {
        std::string res("unrecognized MODULE type");
        v8::Local<Value> ret[] = {v8::String::NewFromUtf8(isolate, res.c_str()), v8::Null(isolate)};
        cb->Call(v8::Null(isolate), 2, ret);
        return;
    }

    json records = json::parse(std::string(*blf_records).c_str());
    if (BLF_write(module, std::string(*blf_filepath).c_str(), records))
    {
        v8::Local<Value> ret[] = {v8::Boolean::New(isolate, true)};
        cb->Call(v8::Null(isolate), 1, ret);
    }
    else
    {
        v8::Local<Value> ret[] = {v8::Boolean::New(isolate, false)};
        cb->Call(v8::Null(isolate), 1, ret);
    }
}

void init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module)
{
    NODE_SET_METHOD(exports, "read", NODE_CONVERT_BLF_read);
    NODE_SET_METHOD(exports, "write", NODE_CONVERT_BLF_write);
}

NODE_MODULE(CONVERTER, init)
