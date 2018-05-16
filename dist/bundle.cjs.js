'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = _interopDefault(require('os'));
var tty = _interopDefault(require('tty'));
var util = _interopDefault(require('util'));
var fs = _interopDefault(require('fs'));
var url = _interopDefault(require('url'));
var child_process = _interopDefault(require('child_process'));
var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var buffer = _interopDefault(require('buffer'));
var bufferutil = _interopDefault(require('bufferutil'));
var zlib = _interopDefault(require('zlib'));
var utf8Validate = _interopDefault(require('utf-8-validate'));
var crypto = _interopDefault(require('crypto'));
var events = _interopDefault(require('events'));
var assert = _interopDefault(require('assert'));
var require$$0 = _interopDefault(require('stream'));
var path = _interopDefault(require('path'));

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);
});

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var regenerator = runtimeModule;

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1 = _core.version;

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var _redefine = _hide;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var _iterators = {};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$1 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var ITERATOR$2 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var process$1 = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process$1) == 'process') {
    defer = function (id) {
      process$1.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$2 = _global.process;
var Promise$1 = _global.Promise;
var isNode = _cof(process$2) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process$2.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    var promise = Promise$1.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$1 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$1
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$3] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

var task = _task.set;
var microtask = _microtask();



var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process$3 = _global.process;
var $Promise = _global[PROMISE];
var isNode$1 = _classof(process$3) == 'process';
var empty = function () { /* empty */ };
var Internal;
var newGenericPromiseCapability;
var OwnPromiseCapability;
var Wrapper;
var newPromiseCapability$1 = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode$1 || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode$1) {
          process$3.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode$1) {
      process$3.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability$1(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode$1 ? process$3.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return _promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return _promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

// https://github.com/tc39/proposal-promise-try




_export(_export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = _newPromiseCapability.f(this);
  var result = _perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

var promise = _core.Promise;

var promise$2 = createCommonjsModule(function (module) {
module.exports = { "default": promise, __esModule: true };
});

var _Promise = unwrapExports(promise$2);

var asyncToGenerator = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _promise2 = _interopRequireDefault(promise$2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
});

var _asyncToGenerator = unwrapExports(asyncToGenerator);

var classCallCheck = createCommonjsModule(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$2 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty, __esModule: true };
});

unwrapExports(defineProperty$2);

var createClass = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

var Event = require('events');
var ioClient = require('socket.io-client');

function addEventHandlers(socket, emitter) {
  if (!socket) return;

  socket.on('probe_status', function (message) {
    emitter.emit('probe_status', message);
  });
  socket.on('event', function (message) {
    emitter.emit('event', message);
  });
  socket.on('command_result', function (message) {
    emitter.emit('command_result', message);
  });
  socket.on('unknown', function (message) {
    emitter.emit('unknown', message);
  });
}

var AdroidProberProxy = function () {
  function AdroidProberProxy(option) {
    _classCallCheck(this, AdroidProberProxy);

    this.emitter = new Event();
    this.option = option;
    this.socket = null;
  }

  _createClass(AdroidProberProxy, [{
    key: 'listen',
    value: function listen() {
      return this.emitter;
    }
  }, {
    key: 'connect',
    value: function connect() {
      var _this = this;

      this.socket = ioClient.connect('http://' + this.option.host + ':' + this.option.port + '/socket');
      addEventHandlers(this.socket, this.emitter);

      this.socket.on('connect', _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('Connected to ZD-SWAG-AndroidProberProxy Service on: ' + _this.option.host + ':' + _this.option.port);

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      })));

      this.socket.on('reconnect', function (attemptNumber) {
        console.log('Connected to ZD-SWAG-AndroidProberProxy Service on: ' + _this.option.host + ':' + _this.option.port + ', after ' + attemptNumber + ' times attemptions');
      });

      this.socket.on('disconnect', function (reason) {
        console.log('Disonnected to ZD-SWAG-AndroidProberProxy Service on: ' + _this.option.host + ':' + _this.option.port + ', reason:', reason);
      });

      this.socket.on('error', function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'start',
    value: function start() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }]);

  return AdroidProberProxy;
}();

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator = core_getIterator;

var getIterator$2 = createCommonjsModule(function (module) {
module.exports = { "default": getIterator, __esModule: true };
});

var _getIterator = unwrapExports(getIterator$2);

// most Object methods by ES6 should accept primitives



var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)



_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var keys = _core.Object.keys;

var keys$2 = createCommonjsModule(function (module) {
module.exports = { "default": keys, __esModule: true };
});

var _Object$keys = unwrapExports(keys$2);

var $JSON = _core.JSON || (_core.JSON = { stringify: JSON.stringify });
var stringify = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};

var stringify$2 = createCommonjsModule(function (module) {
module.exports = { "default": stringify, __esModule: true };
});

var _JSON$stringify = unwrapExports(stringify$2);

/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

var parseuri = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms$$1 = curr - (prevTime || curr);
    self.diff = ms$$1;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});

var debug_1 = debug.coerce;
var debug_2 = debug.disable;
var debug_3 = debug.enable;
var debug_4 = debug.enabled;
var debug_5 = debug.humanize;
var debug_6 = debug.instances;
var debug_7 = debug.names;
var debug_8 = debug.skips;
var debug_9 = debug.formatters;

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});

var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

var hasFlag = function (flag, argv) {
	argv = argv || process.argv;

	var terminatorPos = argv.indexOf('--');
	var prefix = /^-{1,2}/.test(flag) ? '' : '--';
	var pos = argv.indexOf(prefix + flag);

	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

var supportsColor = createCommonjsModule(function (module) {
const env = process.env;

const support = level => {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
};

let supportLevel = (() => {
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return 1;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return 0;
	}

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return 0;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Hyper':
				return 3;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return 0;
	}

	return 0;
})();

if ('FORCE_COLOR' in env) {
	supportLevel = parseInt(env.FORCE_COLOR, 10) === 0 ? 0 : (supportLevel || 1);
}

module.exports = process && support(supportLevel);
});

var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor$$1 = supportsColor;
  if (supportsColor$$1 && supportsColor$$1.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug$$1) {
  debug$$1.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug$$1.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});

var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;

var src = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = browser;
} else {
  module.exports = node;
}
});

/**
 * Module dependencies.
 */


var debug$2 = src('socket.io-client:url');

/**
 * Module exports.
 */

var url_1 = url$1;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url$1 (uri, loc) {
  var obj = uri;

  // default to window.location
  loc = loc || commonjsGlobal.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' === typeof uri) {
    if ('/' === uri.charAt(0)) {
      if ('/' === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug$2('protocol-less url %s', uri);
      if ('undefined' !== typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug$2('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

  return obj;
}

var debug$3 = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms$$1 = curr - (prevTime || curr);
    self.diff = ms$$1;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});

var debug_1$1 = debug$3.coerce;
var debug_2$1 = debug$3.disable;
var debug_3$1 = debug$3.enable;
var debug_4$1 = debug$3.enabled;
var debug_5$1 = debug$3.humanize;
var debug_6$1 = debug$3.instances;
var debug_7$1 = debug$3.names;
var debug_8$1 = debug$3.skips;
var debug_9$1 = debug$3.formatters;

var browser$2 = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug$3;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});

var browser_1$1 = browser$2.log;
var browser_2$1 = browser$2.formatArgs;
var browser_3$1 = browser$2.save;
var browser_4$1 = browser$2.load;
var browser_5$1 = browser$2.useColors;
var browser_6$1 = browser$2.storage;
var browser_7$1 = browser$2.colors;

var node$2 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug$3;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor$$1 = supportsColor;
  if (supportsColor$$1 && supportsColor$$1.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});

var node_1$1 = node$2.init;
var node_2$1 = node$2.log;
var node_3$1 = node$2.formatArgs;
var node_4$1 = node$2.save;
var node_5$1 = node$2.load;
var node_6$1 = node$2.useColors;
var node_7$1 = node$2.colors;
var node_8$1 = node$2.inspectOpts;

var src$2 = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = browser$2;
} else {
  module.exports = node$2;
}
});

var componentEmitter = createCommonjsModule(function (module) {
/**
 * Expose `Emitter`.
 */

{
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
});

var toString$1 = {}.toString;

var isarray = Array.isArray || function (arr) {
  return toString$1.call(arr) == '[object Array]';
};

var isBuffer = isBuf;

var withNativeBuffer = typeof commonjsGlobal.Buffer === 'function' && typeof commonjsGlobal.Buffer.isBuffer === 'function';
var withNativeArrayBuffer = typeof commonjsGlobal.ArrayBuffer === 'function';

var isView = (function () {
  if (withNativeArrayBuffer && typeof commonjsGlobal.ArrayBuffer.isView === 'function') {
    return commonjsGlobal.ArrayBuffer.isView;
  } else {
    return function (obj) { return obj.buffer instanceof commonjsGlobal.ArrayBuffer; };
  }
})();

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (withNativeBuffer && commonjsGlobal.Buffer.isBuffer(obj)) ||
          (withNativeArrayBuffer && (obj instanceof commonjsGlobal.ArrayBuffer || isView(obj)));
}

/*global Blob,File*/

/**
 * Module requirements
 */



var toString$2 = Object.prototype.toString;
var withNativeBlob = typeof commonjsGlobal.Blob === 'function' || toString$2.call(commonjsGlobal.Blob) === '[object BlobConstructor]';
var withNativeFile = typeof commonjsGlobal.File === 'function' || toString$2.call(commonjsGlobal.File) === '[object FileConstructor]';

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

var deconstructPacket = function(packet) {
  var buffers = [];
  var packetData = packet.data;
  var pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

function _deconstructPacket(data, buffers) {
  if (!data) return data;

  if (isBuffer(data)) {
    var placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (isarray(data)) {
    var newData = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === 'object' && !(data instanceof Date)) {
    var newData = {};
    for (var key in data) {
      newData[key] = _deconstructPacket(data[key], buffers);
    }
    return newData;
  }
  return data;
}

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

var reconstructPacket = function(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = undefined; // no longer useful
  return packet;
};

function _reconstructPacket(data, buffers) {
  if (!data) return data;

  if (data && data._placeholder) {
    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
  } else if (isarray(data)) {
    for (var i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === 'object') {
    for (var key in data) {
      data[key] = _reconstructPacket(data[key], buffers);
    }
  }

  return data;
}

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

var removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isarray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (typeof obj === 'object' && !isBuffer(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

var binary = {
	deconstructPacket: deconstructPacket,
	reconstructPacket: reconstructPacket,
	removeBlobs: removeBlobs
};

var socket_ioParser = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */

var debug = src$2('socket.io-parser');





/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

var ERROR_PACKET = exports.ERROR + '"encode error"';

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    encodeAsBinary(obj, callback);
  } else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {

  // first is type
  var str = '' + obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    str += obj.attachments + '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' !== obj.nsp) {
    str += obj.nsp + ',';
  }

  // immediately followed by the id
  if (null != obj.id) {
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    var payload = tryStringify(obj.data);
    if (payload !== false) {
      str += payload;
    } else {
      return ERROR_PACKET;
    }
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

function tryStringify(str) {
  try {
    return JSON.stringify(str);
  } catch(e){
    return false;
  }
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

componentEmitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if (typeof obj === 'string') {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuffer(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var i = 0;
  // look up type
  var p = {
    type: Number(str.charAt(0))
  };

  if (null == exports.types[p.type]) {
    return error('unknown packet type ' + p.type);
  }

  // look up attachments if type binary
  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
    var buf = '';
    while (str.charAt(++i) !== '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) !== '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' === str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' === c) break;
      p.nsp += c;
      if (i === str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i === str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    var payload = tryParse(str.substr(i));
    var isPayloadValid = payload !== false && (p.type === exports.ERROR || isarray(payload));
    if (isPayloadValid) {
      p.data = payload;
    } else {
      return error('invalid payload');
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch(e){
    return false;
  }
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(msg) {
  return {
    type: exports.ERROR,
    data: 'parser error: ' + msg
  };
}
});

var socket_ioParser_1 = socket_ioParser.protocol;
var socket_ioParser_2 = socket_ioParser.types;
var socket_ioParser_3 = socket_ioParser.CONNECT;
var socket_ioParser_4 = socket_ioParser.DISCONNECT;
var socket_ioParser_5 = socket_ioParser.EVENT;
var socket_ioParser_6 = socket_ioParser.ACK;
var socket_ioParser_7 = socket_ioParser.ERROR;
var socket_ioParser_8 = socket_ioParser.BINARY_EVENT;
var socket_ioParser_9 = socket_ioParser.BINARY_ACK;
var socket_ioParser_10 = socket_ioParser.Encoder;
var socket_ioParser_11 = socket_ioParser.Decoder;

/**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 */



var spawn = child_process.spawn;

/**
 * Module exports.
 */

var XMLHttpRequest_1 = XMLHttpRequest$1;

// backwards-compat
XMLHttpRequest$1.XMLHttpRequest = XMLHttpRequest$1;

/**
 * `XMLHttpRequest` constructor.
 *
 * Supported options for the `opts` object are:
 *
 *  - `agent`: An http.Agent instance; http.globalAgent may be used; if 'undefined', agent usage is disabled
 *
 * @param {Object} opts optional "options" object
 */

function XMLHttpRequest$1(opts) {
  opts = opts || {};

  /**
   * Private variables
   */
  var self = this;
  var http$$1 = http;
  var https$$1 = https;

  // Holds http.js objects
  var request;
  var response;

  // Request settings
  var settings = {};

  // Disable header blacklist.
  // Not part of XHR specs.
  var disableHeaderCheck = false;

  // Set some default headers
  var defaultHeaders = {
    "User-Agent": "node-XMLHttpRequest",
    "Accept": "*/*"
  };

  var headers = Object.assign({}, defaultHeaders);

  // These headers are not user setable.
  // The following are allowed but banned in the spec:
  // * user-agent
  var forbiddenRequestHeaders = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "content-transfer-encoding",
    "cookie",
    "cookie2",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "via"
  ];

  // These request methods are not allowed
  var forbiddenRequestMethods = [
    "TRACE",
    "TRACK",
    "CONNECT"
  ];

  // Send flag
  var sendFlag = false;
  // Error flag, used when errors occur or abort is called
  var errorFlag = false;

  // Event listeners
  var listeners = {};

  /**
   * Constants
   */

  this.UNSENT = 0;
  this.OPENED = 1;
  this.HEADERS_RECEIVED = 2;
  this.LOADING = 3;
  this.DONE = 4;

  /**
   * Public vars
   */

  // Current state
  this.readyState = this.UNSENT;

  // default ready state change handler in case one is not set or is set late
  this.onreadystatechange = null;

  // Result & response
  this.responseText = "";
  this.responseXML = "";
  this.status = null;
  this.statusText = null;

  /**
   * Private methods
   */

  /**
   * Check if the specified header is allowed.
   *
   * @param string header Header to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpHeader = function(header) {
    return disableHeaderCheck || (header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1);
  };

  /**
   * Check if the specified method is allowed.
   *
   * @param string method Request method to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpMethod = function(method) {
    return (method && forbiddenRequestMethods.indexOf(method) === -1);
  };

  /**
   * Public methods
   */

  /**
   * Open the connection. Currently supports local server requests.
   *
   * @param string method Connection method (eg GET, POST)
   * @param string url URL for the connection.
   * @param boolean async Asynchronous connection. Default is true.
   * @param string user Username for basic authentication (optional)
   * @param string password Password for basic authentication (optional)
   */
  this.open = function(method, url$$1, async, user, password) {
    this.abort();
    errorFlag = false;

    // Check for valid request method
    if (!isAllowedHttpMethod(method)) {
      throw "SecurityError: Request method not allowed";
    }

    settings = {
      "method": method,
      "url": url$$1.toString(),
      "async": (typeof async !== "boolean" ? true : async),
      "user": user || null,
      "password": password || null
    };

    setState(this.OPENED);
  };

  /**
   * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
   * This does not conform to the W3C spec.
   *
   * @param boolean state Enable or disable header checking.
   */
  this.setDisableHeaderCheck = function(state) {
    disableHeaderCheck = state;
  };

  /**
   * Sets a header for the request.
   *
   * @param string header Header name
   * @param string value Header value
   * @return boolean Header added
   */
  this.setRequestHeader = function(header, value) {
    if (this.readyState != this.OPENED) {
      throw "INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN";
      return false;
    }
    if (!isAllowedHttpHeader(header)) {
      console.warn('Refused to set unsafe header "' + header + '"');
      return false;
    }
    if (sendFlag) {
      throw "INVALID_STATE_ERR: send flag is true";
      return false;
    }
    headers[header] = value;
    return true;
  };

  /**
   * Gets a header from the server response.
   *
   * @param string header Name of header to get.
   * @return string Text of the header or null if it doesn't exist.
   */
  this.getResponseHeader = function(header) {
    if (typeof header === "string"
      && this.readyState > this.OPENED
      && response.headers[header.toLowerCase()]
      && !errorFlag
    ) {
      return response.headers[header.toLowerCase()];
    }

    return null;
  };

  /**
   * Gets all the response headers.
   *
   * @return string A string with all response headers separated by CR+LF
   */
  this.getAllResponseHeaders = function() {
    if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
      return "";
    }
    var result = "";

    for (var i in response.headers) {
      // Cookie headers are excluded
      if (i !== "set-cookie" && i !== "set-cookie2") {
        result += i + ": " + response.headers[i] + "\r\n";
      }
    }
    return result.substr(0, result.length - 2);
  };

  /**
   * Gets a request header
   *
   * @param string name Name of header to get
   * @return string Returns the request header or empty string if not set
   */
  this.getRequestHeader = function(name) {
    // @TODO Make this case insensitive
    if (typeof name === "string" && headers[name]) {
      return headers[name];
    }

    return "";
  };

  /**
   * Sends the request to the server.
   *
   * @param string data Optional data to send as request body.
   */
  this.send = function(data) {
    if (this.readyState != this.OPENED) {
      throw "INVALID_STATE_ERR: connection must be opened before send() is called";
    }

    if (sendFlag) {
      throw "INVALID_STATE_ERR: send has already been called";
    }

    var ssl = false, local = false;
    var url$$1 = url.parse(settings.url);
    var host;
    // Determine the server
    switch (url$$1.protocol) {
      case 'https:':
        ssl = true;
        // SSL & non-SSL both need host, no break here.
      case 'http:':
        host = url$$1.hostname;
        break;

      case 'file:':
        local = true;
        break;

      case undefined:
      case '':
        host = "localhost";
        break;

      default:
        throw "Protocol not supported.";
    }

    // Load files off the local filesystem (file://)
    if (local) {
      if (settings.method !== "GET") {
        throw "XMLHttpRequest: Only GET method is supported";
      }

      if (settings.async) {
        fs.readFile(url$$1.pathname, 'utf8', function(error, data) {
          if (error) {
            self.handleError(error);
          } else {
            self.status = 200;
            self.responseText = data;
            setState(self.DONE);
          }
        });
      } else {
        try {
          this.responseText = fs.readFileSync(url$$1.pathname, 'utf8');
          this.status = 200;
          setState(self.DONE);
        } catch(e) {
          this.handleError(e);
        }
      }

      return;
    }

    // Default to port 80. If accessing localhost on another port be sure
    // to use http://localhost:port/path
    var port = url$$1.port || (ssl ? 443 : 80);
    // Add query string if one is used
    var uri = url$$1.pathname + (url$$1.search ? url$$1.search : '');

    // Set the Host header or the server may reject the request
    headers["Host"] = host;
    if (!((ssl && port === 443) || port === 80)) {
      headers["Host"] += ':' + url$$1.port;
    }

    // Set Basic Auth if necessary
    if (settings.user) {
      if (typeof settings.password == "undefined") {
        settings.password = "";
      }
      var authBuf = new Buffer(settings.user + ":" + settings.password);
      headers["Authorization"] = "Basic " + authBuf.toString("base64");
    }

    // Set content length header
    if (settings.method === "GET" || settings.method === "HEAD") {
      data = null;
    } else if (data) {
      headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);

      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
    } else if (settings.method === "POST") {
      // For a post with no data set Content-Length: 0.
      // This is required by buggy servers that don't meet the specs.
      headers["Content-Length"] = 0;
    }

    var agent = opts.agent || false;
    var options = {
      host: host,
      port: port,
      path: uri,
      method: settings.method,
      headers: headers,
      agent: agent
    };

    if (ssl) {
      options.pfx = opts.pfx;
      options.key = opts.key;
      options.passphrase = opts.passphrase;
      options.cert = opts.cert;
      options.ca = opts.ca;
      options.ciphers = opts.ciphers;
      options.rejectUnauthorized = opts.rejectUnauthorized;
    }

    // Reset error flag
    errorFlag = false;

    // Handle async requests
    if (settings.async) {
      // Use the proper protocol
      var doRequest = ssl ? https$$1.request : http$$1.request;

      // Request is being sent, set send flag
      sendFlag = true;

      // As per spec, this is called here for historical reasons.
      self.dispatchEvent("readystatechange");

      // Handler for the response
      var responseHandler = function(resp) {
        // Set response var to the response we got back
        // This is so it remains accessable outside this scope
        response = resp;
        // Check for redirect
        // @TODO Prevent looped redirects
        if (response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
          // Change URL to the redirect location
          settings.url = response.headers.location;
          var url$$1 = url.parse(settings.url);
          // Set host var in case it's used later
          host = url$$1.hostname;
          // Options for the new request
          var newOptions = {
            hostname: url$$1.hostname,
            port: url$$1.port,
            path: url$$1.path,
            method: response.statusCode === 303 ? 'GET' : settings.method,
            headers: headers
          };

          if (ssl) {
            newOptions.pfx = opts.pfx;
            newOptions.key = opts.key;
            newOptions.passphrase = opts.passphrase;
            newOptions.cert = opts.cert;
            newOptions.ca = opts.ca;
            newOptions.ciphers = opts.ciphers;
            newOptions.rejectUnauthorized = opts.rejectUnauthorized;
          }

          // Issue the new request
          request = doRequest(newOptions, responseHandler).on('error', errorHandler);
          request.end();
          // @TODO Check if an XHR event needs to be fired here
          return;
        }

        if (response && response.setEncoding) {
          response.setEncoding("utf8");
        }

        setState(self.HEADERS_RECEIVED);
        self.status = response.statusCode;

        response.on('data', function(chunk) {
          // Make sure there's some data
          if (chunk) {
            self.responseText += chunk;
          }
          // Don't emit state changes if the connection has been aborted.
          if (sendFlag) {
            setState(self.LOADING);
          }
        });

        response.on('end', function() {
          if (sendFlag) {
            // The sendFlag needs to be set before setState is called.  Otherwise if we are chaining callbacks
            // there can be a timing issue (the callback is called and a new call is made before the flag is reset).
            sendFlag = false;
            // Discard the 'end' event if the connection has been aborted
            setState(self.DONE);
          }
        });

        response.on('error', function(error) {
          self.handleError(error);
        });
      };

      // Error handler for the request
      var errorHandler = function(error) {
        self.handleError(error);
      };

      // Create the request
      request = doRequest(options, responseHandler).on('error', errorHandler);

      // Node 0.4 and later won't accept empty data. Make sure it's needed.
      if (data) {
        request.write(data);
      }

      request.end();

      self.dispatchEvent("loadstart");
    } else { // Synchronous
      // Create a temporary file for communication with the other Node process
      var contentFile = ".node-xmlhttprequest-content-" + process.pid;
      var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
      fs.writeFileSync(syncFile, "", "utf8");
      // The async request the other Node process executes
      var execString = "var http = require('http'), https = require('https'), fs = require('fs');"
        + "var doRequest = http" + (ssl ? "s" : "") + ".request;"
        + "var options = " + JSON.stringify(options) + ";"
        + "var responseText = '';"
        + "var req = doRequest(options, function(response) {"
        + "response.setEncoding('utf8');"
        + "response.on('data', function(chunk) {"
        + "  responseText += chunk;"
        + "});"
        + "response.on('end', function() {"
        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-STATUS:' + response.statusCode + ',' + responseText, 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + "response.on('error', function(error) {"
        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + "}).on('error', function(error) {"
        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + (data ? "req.write('" + data.replace(/'/g, "\\'") + "');":"")
        + "req.end();";
      // Start the other Node Process, executing this string
      var syncProc = spawn(process.argv[0], ["-e", execString]);
      while(fs.existsSync(syncFile)) {
        // Wait while the sync file is empty
      }
      self.responseText = fs.readFileSync(contentFile, 'utf8');
      // Kill the child process once the file has data
      syncProc.stdin.end();
      // Remove the temporary file
      fs.unlinkSync(contentFile);
      if (self.responseText.match(/^NODE-XMLHTTPREQUEST-ERROR:/)) {
        // If the file returned an error, handle it
        var errorObj = self.responseText.replace(/^NODE-XMLHTTPREQUEST-ERROR:/, "");
        self.handleError(errorObj);
      } else {
        // If the file returned okay, parse its data and move to the DONE state
        self.status = self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:([0-9]*),.*/, "$1");
        self.responseText = self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:[0-9]*,(.*)/, "$1");
        setState(self.DONE);
      }
    }
  };

  /**
   * Called when an error is encountered to deal with it.
   */
  this.handleError = function(error) {
    this.status = 503;
    this.statusText = error;
    this.responseText = error.stack;
    errorFlag = true;
    setState(this.DONE);
  };

  /**
   * Aborts a request.
   */
  this.abort = function() {
    if (request) {
      request.abort();
      request = null;
    }

    headers = Object.assign({}, defaultHeaders);
    this.responseText = "";
    this.responseXML = "";

    errorFlag = true;

    if (this.readyState !== this.UNSENT
        && (this.readyState !== this.OPENED || sendFlag)
        && this.readyState !== this.DONE) {
      sendFlag = false;
      setState(this.DONE);
    }
    this.readyState = this.UNSENT;
  };

  /**
   * Adds an event listener. Preferred method of binding to events.
   */
  this.addEventListener = function(event, callback) {
    if (!(event in listeners)) {
      listeners[event] = [];
    }
    // Currently allows duplicate callbacks. Should it?
    listeners[event].push(callback);
  };

  /**
   * Remove an event callback that has already been bound.
   * Only works on the matching funciton, cannot be a copy.
   */
  this.removeEventListener = function(event, callback) {
    if (event in listeners) {
      // Filter will return a new array with the callback removed
      listeners[event] = listeners[event].filter(function(ev) {
        return ev !== callback;
      });
    }
  };

  /**
   * Dispatch any events, including both "on" methods and events attached using addEventListener.
   */
  this.dispatchEvent = function(event) {
    if (typeof self["on" + event] === "function") {
      self["on" + event]();
    }
    if (event in listeners) {
      for (var i = 0, len = listeners[event].length; i < len; i++) {
        listeners[event][i].call(self);
      }
    }
  };

  /**
   * Changes readyState and calls onreadystatechange.
   *
   * @param int state New state
   */
  var setState = function(state) {
    if (self.readyState !== state) {
      self.readyState = state;

      if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
        self.dispatchEvent("readystatechange");
      }

      if (self.readyState === self.DONE && !errorFlag) {
        self.dispatchEvent("load");
        // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
        self.dispatchEvent("loadend");
      }
    }
  };
}

var utf8 = createCommonjsModule(function (module, exports) {
/*! https://mths.be/utf8js v2.1.2 by @mathias */
(function(root) {

	// Detect free variables `exports`
	var freeExports = 'object' == 'object' && exports;

	// Detect free variable `module`
	var freeModule = 'object' == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint, strict) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			if (strict) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
			return false;
		}
		return true;
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint, strict) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			if (!checkScalarValue(codePoint, strict)) {
				codePoint = 0xFFFD;
			}
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;

		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint, strict);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol(strict) {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;

		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol(strict)) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.1.2',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof undefined == 'function' &&
		typeof undefined.amd == 'object' &&
		undefined.amd
	) {
		undefined(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(commonjsGlobal));
});

var toString$3 = {}.toString;

var isarray$2 = Array.isArray || function (arr) {
  return toString$3.call(arr) == '[object Array]';
};

/* global Blob File */

/*
 * Module requirements.
 */



var toString$4 = Object.prototype.toString;
var withNativeBlob$1 = typeof commonjsGlobal.Blob === 'function' || toString$4.call(commonjsGlobal.Blob) === '[object BlobConstructor]';
var withNativeFile$1 = typeof commonjsGlobal.File === 'function' || toString$4.call(commonjsGlobal.File) === '[object FileConstructor]';

/**
 * Module exports.
 */

var hasBinary2 = hasBinary;

/**
 * Checks for binary data.
 *
 * Supports Buffer, ArrayBuffer, Blob and File.
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary (obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (isarray$2(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }

  if ((typeof commonjsGlobal.Buffer === 'function' && commonjsGlobal.Buffer.isBuffer && commonjsGlobal.Buffer.isBuffer(obj)) ||
     (typeof commonjsGlobal.ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
     (withNativeBlob$1 && obj instanceof Blob) ||
     (withNativeFile$1 && obj instanceof File)
    ) {
    return true;
  }

  // see: https://github.com/Automattic/has-binary/pull/4
  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }

  return false;
}

var after_1 = after;

function after(count, callback, err_cb) {
    var bail = false;
    err_cb = err_cb || noop;
    proxy.count = count;

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count;

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true;
            callback(err);
            // future error callbacks will go to error handler
            callback = err_cb;
        } else if (proxy.count === 0 && !bail) {
            callback(null, result);
        }
    }
}

function noop() {}

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

var keys$3 = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

var lib = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */






/**
 * Current protocol version.
 */
exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys$3(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  if (typeof utf8encode === 'function') {
    callback = utf8encode;
    utf8encode = null;
  }

  if (Buffer.isBuffer(packet.data)) {
    return encodeBuffer(packet, supportsBinary, callback);
  } else if (packet.data && (packet.data.buffer || packet.data) instanceof ArrayBuffer) {
    packet.data = arrayBufferToBuffer(packet.data);
    return encodeBuffer(packet, supportsBinary, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
  }

  return callback('' + encoded);
};

/**
 * Encode Buffer data
 */

function encodeBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var typeBuffer = new Buffer(1);
  typeBuffer[0] = packets[packet.type];
  return callback(Buffer.concat([typeBuffer, data]));
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback){
  if (!Buffer.isBuffer(packet.data)) {
    packet.data = arrayBufferToBuffer(packet.data);
  }

  var message = 'b' + packets[packet.type];
  message += packet.data.toString('base64');
  return callback(message);
};

/**
 * Decodes a packet. Data also available as an ArrayBuffer if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }

  var type;

  // String data
  if (typeof data === 'string') {

    type = data.charAt(0);

    if (type === 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  // Binary data
  if (binaryType === 'arraybuffer') {
    // wrap Buffer/ArrayBuffer data into an Uint8Array
    var intArray = new Uint8Array(data);
    type = intArray[0];
    return { type: packetslist[type], data: intArray.buffer.slice(1) };
  }

  if (data instanceof ArrayBuffer) {
    data = arrayBufferToBuffer(data);
  }
  type = data[0];
  return { type: packetslist[type], data: data.slice(1) };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data, { strict: false });
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string.
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  var data = new Buffer(msg.substr(1), 'base64');
  if (binaryType === 'arraybuffer') {
    var abv = new Uint8Array(data.length);
    for (var i = 0; i < abv.length; i++){
      abv[i] = data[i];
    }
    data = abv.buffer;
  }
  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  if (supportsBinary && hasBinary2(packets)) {
    return exports.encodePayloadAsBinary(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, supportsBinary, false, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

function setLengthHeader(message) {
  return message.length + ':' + message;
}

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after_1(ary.length, done);

  for (var i = 0; i < ary.length; i++) {
    each(ary[i], function(error, msg) {
      result[i] = msg;
      next(error, result);
    });
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data !== 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  if (data === '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = '', n, msg, packet;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (chr !== ':') {
      length += chr;
      continue;
    }

    if (length === '' || (length != (n = Number(length)))) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    msg = data.substr(i + 1, n);

    if (length != msg.length) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    if (msg.length) {
      packet = exports.decodePacket(msg, binaryType, false);

      if (err.type === packet.type && err.data === packet.data) {
        // parser error in individual packet - ignoring payload
        return callback(err, 0, 1);
      }

      var more = callback(packet, i + n, l);
      if (false === more) return;
    }

    // advance cursor
    i += n;
    length = '';
  }

  if (length !== '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 *
 * Converts a buffer to a utf8.js encoded string
 *
 * @api private
 */

function bufferToString(buffer$$1) {
  var str = '';
  for (var i = 0, l = buffer$$1.length; i < l; i++) {
    str += String.fromCharCode(buffer$$1[i]);
  }
  return str;
}

/**
 *
 * Converts a utf8.js encoded string to a buffer
 *
 * @api private
 */

function stringToBuffer(string) {
  var buf = new Buffer(string.length);
  for (var i = 0, l = string.length; i < l; i++) {
    buf.writeUInt8(string.charCodeAt(i), i);
  }
  return buf;
}

/**
 *
 * Converts an ArrayBuffer to a Buffer
 *
 * @api private
 */

function arrayBufferToBuffer(data) {
  // data is either an ArrayBuffer or ArrayBufferView.
  var array = new Uint8Array(data.buffer || data);
  var length = data.byteLength || data.length;
  var offset = data.byteOffset || 0;
  var buffer$$1 = new Buffer(length);

  for (var i = 0; i < length; i++) {
    buffer$$1[i] = array[offset + i];
  }
  return buffer$$1;
}

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {Buffer} encoded payload
 * @api private
 */

exports.encodePayloadAsBinary = function (packets, callback) {
  if (!packets.length) {
    return callback(new Buffer(0));
  }

  map(packets, encodeOneBinaryPacket, function(err, results) {
    return callback(Buffer.concat(results));
  });
};

function encodeOneBinaryPacket(p, doneCallback) {

  function onBinaryPacketEncode(packet) {

    var encodingLength = '' + packet.length;
    var sizeBuffer;

    if (typeof packet === 'string') {
      sizeBuffer = new Buffer(encodingLength.length + 2);
      sizeBuffer[0] = 0; // is a string (not true binary = 0)
      for (var i = 0; i < encodingLength.length; i++) {
        sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
      }
      sizeBuffer[sizeBuffer.length - 1] = 255;
      return doneCallback(null, Buffer.concat([sizeBuffer, stringToBuffer(packet)]));
    }

    sizeBuffer = new Buffer(encodingLength.length + 2);
    sizeBuffer[0] = 1; // is binary (true binary = 1)
    for (var i = 0; i < encodingLength.length; i++) {
      sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
    }
    sizeBuffer[sizeBuffer.length - 1] = 255;

    doneCallback(null, Buffer.concat([sizeBuffer, packet]));
  }

  exports.encodePacket(p, true, true, onBinaryPacketEncode);

}


/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary

 * @param {Buffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];
  var i;

  while (bufferTail.length > 0) {
    var strLen = '';
    var isString = bufferTail[0] === 0;
    for (i = 1; ; i++) {
      if (bufferTail[i] === 255)  break;
      // 310 = char length of Number.MAX_VALUE
      if (strLen.length > 310) {
        return callback(err, 0, 1);
      }
      strLen += '' + bufferTail[i];
    }
    bufferTail = bufferTail.slice(strLen.length + 1);

    var msgLength = parseInt(strLen, 10);

    var msg = bufferTail.slice(1, msgLength + 1);
    if (isString) msg = bufferToString(msg);
    buffers.push(msg);
    bufferTail = bufferTail.slice(msgLength + 1);
  }

  var total = buffers.length;
  for (i = 0; i < total; i++) {
    var buffer$$1 = buffers[i];
    callback(exports.decodePacket(buffer$$1, binaryType, true), i, total);
  }
};
});

var lib_1 = lib.protocol;
var lib_2 = lib.packets;
var lib_3 = lib.encodePacket;
var lib_4 = lib.encodeBase64Packet;
var lib_5 = lib.decodePacket;
var lib_6 = lib.decodeBase64Packet;
var lib_7 = lib.encodePayload;
var lib_8 = lib.decodePayload;
var lib_9 = lib.encodePayloadAsBinary;
var lib_10 = lib.decodePayloadAsBinary;

/**
 * Module dependencies.
 */




/**
 * Module exports.
 */

var transport = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

componentEmitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = lib.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

var encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

var decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

var parseqs = {
	encode: encode,
	decode: decode
};

var componentInherit = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('');
var length = 64;
var map = {};
var seed = 0;
var i$1 = 0;
var prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode$1(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode$1(str) {
  var decoded = 0;

  for (i$1 = 0; i$1 < str.length; i$1++) {
    decoded = decoded * length + map[str.charAt(i$1)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode$1(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode$1(seed++);
}

//
// Map each character to its index.
//
for (; i$1 < length; i$1++) map[alphabet[i$1]] = i$1;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode$1;
yeast.decode = decode$1;
var yeast_1 = yeast;

var debug$5 = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms$$1 = curr - (prevTime || curr);
    self.diff = ms$$1;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});

var debug_1$2 = debug$5.coerce;
var debug_2$2 = debug$5.disable;
var debug_3$2 = debug$5.enable;
var debug_4$2 = debug$5.enabled;
var debug_5$2 = debug$5.humanize;
var debug_6$2 = debug$5.instances;
var debug_7$2 = debug$5.names;
var debug_8$2 = debug$5.skips;
var debug_9$2 = debug$5.formatters;

var browser$4 = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug$5;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});

var browser_1$2 = browser$4.log;
var browser_2$2 = browser$4.formatArgs;
var browser_3$2 = browser$4.save;
var browser_4$2 = browser$4.load;
var browser_5$2 = browser$4.useColors;
var browser_6$2 = browser$4.storage;
var browser_7$2 = browser$4.colors;

var node$4 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug$5;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor$$1 = supportsColor;
  if (supportsColor$$1 && supportsColor$$1.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});

var node_1$2 = node$4.init;
var node_2$2 = node$4.log;
var node_3$2 = node$4.formatArgs;
var node_4$2 = node$4.save;
var node_5$2 = node$4.load;
var node_6$2 = node$4.useColors;
var node_7$2 = node$4.colors;
var node_8$2 = node$4.inspectOpts;

var src$4 = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = browser$4;
} else {
  module.exports = node$4;
}
});

/**
 * Module dependencies.
 */






var debug$7 = src$4('engine.io-client:polling');

/**
 * Module exports.
 */

var polling = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function () {
  var XMLHttpRequest = XMLHttpRequest_1;
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

componentInherit(Polling, transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause () {
    debug$7('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug$7('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug$7('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug$7('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug$7('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug$7('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug$7('polling got data %s', data);
  var callback = function (packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  lib.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug$7('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close () {
    debug$7('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug$7('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug$7('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function () {
    self.writable = true;
    self.emit('drain');
  };

  lib.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast_1();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
     ('http' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Module requirements.
 */





var debug$8 = src$4('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

var pollingXhr = XHR;
var Request_1 = Request;

/**
 * Empty function
 */

function empty$1 () {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR (opts) {
  polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;
  this.extraHeaders = opts.extraHeaders;

  if (commonjsGlobal.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname !== commonjsGlobal.location.hostname ||
      port !== opts.port;
    this.xs = opts.secure !== isSSL;
  }
}

/**
 * Inherits from Polling.
 */

componentInherit(XHR, polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug$8('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request (opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

componentEmitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest_1(opts);
  var self = this;

  try {
    debug$8('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          try {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (self.supportsBinary && contentType === 'application/octet-stream') {
              xhr.responseType = 'arraybuffer';
            }
          } catch (e) {}
        }
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug$8('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (commonjsGlobal.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty$1;
  } else {
    this.xhr.onreadystatechange = empty$1;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (commonjsGlobal.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response || this.xhr.responseText;
    } else {
      data = this.xhr.responseText;
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return 'undefined' !== typeof commonjsGlobal.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (commonjsGlobal.document) {
  if (commonjsGlobal.attachEvent) {
    commonjsGlobal.attachEvent('onunload', unloadHandler);
  } else if (commonjsGlobal.addEventListener) {
    commonjsGlobal.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler () {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

pollingXhr.Request = Request_1;

/**
 * Module requirements.
 */




/**
 * Module exports.
 */

var pollingJsonp = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty$2 () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!commonjsGlobal.___eio) commonjsGlobal.___eio = [];
    callbacks = commonjsGlobal.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (commonjsGlobal.document && commonjsGlobal.addEventListener) {
    commonjsGlobal.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty$2;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

componentInherit(JSONPPolling, polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

var has$1 = Object.prototype.hasOwnProperty;

/**
 * An auto incrementing id which we can use to create "unique" Ultron instances
 * so we can track the event emitters that are added through the Ultron
 * interface.
 *
 * @type {Number}
 * @private
 */
var id$1 = 0;

/**
 * Ultron is high-intelligence robot. It gathers intelligence so it can start improving
 * upon his rudimentary design. It will learn from your EventEmitting patterns
 * and exterminate them.
 *
 * @constructor
 * @param {EventEmitter} ee EventEmitter instance we need to wrap.
 * @api public
 */
function Ultron(ee) {
  if (!(this instanceof Ultron)) return new Ultron(ee);

  this.id = id$1++;
  this.ee = ee;
}

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.on = function on(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.on(event, fn, context);

  return this;
};
/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.once = function once(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.once(event, fn, context);

  return this;
};

/**
 * Remove the listeners we assigned for the given event.
 *
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.remove = function remove() {
  var args = arguments
    , ee = this.ee
    , event;

  //
  // When no event names are provided we assume that we need to clear all the
  // events that were assigned through us.
  //
  if (args.length === 1 && 'string' === typeof args[0]) {
    args = args[0].split(/[, ]+/);
  } else if (!args.length) {
    if (ee.eventNames) {
      args = ee.eventNames();
    } else if (ee._events) {
      args = [];

      for (event in ee._events) {
        if (has$1.call(ee._events, event)) args.push(event);
      }

      if (Object.getOwnPropertySymbols) {
        args = args.concat(Object.getOwnPropertySymbols(ee._events));
      }
    }
  }

  for (var i = 0; i < args.length; i++) {
    var listeners = ee.listeners(args[i]);

    for (var j = 0; j < listeners.length; j++) {
      event = listeners[j];

      //
      // Once listeners have a `listener` property that stores the real listener
      // in the EventEmitter that ships with Node.js.
      //
      if (event.listener) {
        if (event.listener.__ultron !== this.id) continue;
      } else if (event.__ultron !== this.id) {
        continue;
      }

      ee.removeListener(args[i], event);
    }
  }

  return this;
};

/**
 * Destroy the Ultron instance, remove all listeners and release all references.
 *
 * @returns {Boolean}
 * @api public
 */
Ultron.prototype.destroy = function destroy() {
  if (!this.ee) return false;

  this.remove();
  this.ee = null;

  return true;
};

//
// Expose the module.
//
var ultron = Ultron;

var safeBuffer = createCommonjsModule(function (module, exports) {
/* eslint-disable node/no-deprecated-api */

var Buffer = buffer.Buffer;

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer;
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size);
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }
  return buf
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
};
});

var safeBuffer_1 = safeBuffer.Buffer;

function Queue(options) {
  if (!(this instanceof Queue)) {
    return new Queue(options);
  }

  options = options || {};
  this.concurrency = options.concurrency || Infinity;
  this.pending = 0;
  this.jobs = [];
  this.cbs = [];
  this._done = done.bind(this);
}

var arrayAddMethods = [
  'push',
  'unshift',
  'splice'
];

arrayAddMethods.forEach(function(method) {
  Queue.prototype[method] = function() {
    var methodResult = Array.prototype[method].apply(this.jobs, arguments);
    this._run();
    return methodResult;
  };
});

Object.defineProperty(Queue.prototype, 'length', {
  get: function() {
    return this.pending + this.jobs.length;
  }
});

Queue.prototype._run = function() {
  if (this.pending === this.concurrency) {
    return;
  }
  if (this.jobs.length) {
    var job = this.jobs.shift();
    this.pending++;
    job(this._done);
    this._run();
  }

  if (this.pending === 0) {
    while (this.cbs.length !== 0) {
      var cb = this.cbs.pop();
      process.nextTick(cb);
    }
  }
};

Queue.prototype.onDone = function(cb) {
  if (typeof cb === 'function') {
    this.cbs.push(cb);
    this._run();
  }
};

function done() {
  this.pending--;
  this._run();
}

var asyncLimiter = Queue;

var BufferUtil = createCommonjsModule(function (module) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

const Buffer = safeBuffer.Buffer;

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
const concat = (list, totalLength) => {
  const target = Buffer.allocUnsafe(totalLength);
  var offset = 0;

  for (var i = 0; i < list.length; i++) {
    const buf = list[i];
    buf.copy(target, offset);
    offset += buf.length;
  }

  return target;
};

try {
  const bufferUtil = bufferutil;

  module.exports = Object.assign({ concat }, bufferUtil.BufferUtil || bufferUtil);
} catch (e) /* istanbul ignore next */ {
  /**
   * Masks a buffer using the given mask.
   *
   * @param {Buffer} source The buffer to mask
   * @param {Buffer} mask The mask to use
   * @param {Buffer} output The buffer where to store the result
   * @param {Number} offset The offset at which to start writing
   * @param {Number} length The number of bytes to mask.
   * @public
   */
  const mask = (source, mask, output, offset, length) => {
    for (var i = 0; i < length; i++) {
      output[offset + i] = source[i] ^ mask[i & 3];
    }
  };

  /**
   * Unmasks a buffer using the given mask.
   *
   * @param {Buffer} buffer The buffer to unmask
   * @param {Buffer} mask The mask to use
   * @public
   */
  const unmask = (buffer$$1, mask) => {
    // Required until https://github.com/nodejs/node/issues/9006 is resolved.
    const length = buffer$$1.length;
    for (var i = 0; i < length; i++) {
      buffer$$1[i] ^= mask[i & 3];
    }
  };

  module.exports = { concat, mask, unmask };
}
});

var BufferUtil_1 = BufferUtil.concat;
var BufferUtil_2 = BufferUtil.mask;
var BufferUtil_3 = BufferUtil.unmask;

const Buffer$1 = safeBuffer.Buffer;

const TRAILER = Buffer$1.from([0x00, 0x00, 0xff, 0xff]);
const EMPTY_BLOCK = Buffer$1.from([0x00]);

const kWriteInProgress = Symbol('write-in-progress');
const kPendingClose = Symbol('pending-close');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');
const kOwner = Symbol('owner');

//
// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's an issue.
//
let zlibLimiter;

/**
 * permessage-deflate implementation.
 */
class PerMessageDeflate {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} options Configuration options
   * @param {Boolean} options.serverNoContextTakeover Request/accept disabling
   *     of server context takeover
   * @param {Boolean} options.clientNoContextTakeover Advertise/acknowledge
   *     disabling of client context takeover
   * @param {(Boolean|Number)} options.serverMaxWindowBits Request/confirm the
   *     use of a custom server window size
   * @param {(Boolean|Number)} options.clientMaxWindowBits Advertise support
   *     for, or request, a custom client window size
   * @param {Number} options.level The value of zlib's `level` param
   * @param {Number} options.memLevel The value of zlib's `memLevel` param
   * @param {Number} options.threshold Size (in bytes) below which messages
   *     should not be compressed
   * @param {Number} options.concurrencyLimit The number of concurrent calls to
   *     zlib
   * @param {Boolean} isServer Create the instance in either server or client
   *     mode
   * @param {Number} maxPayload The maximum allowed message length
   */
  constructor (options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold = this._options.threshold !== undefined
      ? this._options.threshold
      : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency = this._options.concurrencyLimit !== undefined
        ? this._options.concurrencyLimit
        : 10;
      zlibLimiter = new asyncLimiter({ concurrency });
    }
  }

  /**
   * @type {String}
   */
  static get extensionName () {
    return 'permessage-deflate';
  }

  /**
   * Create extension parameters offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer () {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept extension offer.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @public
   */
  accept (paramsList) {
    paramsList = this.normalizeParams(paramsList);

    var params;
    if (this._isServer) {
      params = this.acceptAsServer(paramsList);
    } else {
      params = this.acceptAsClient(paramsList);
    }

    this.params = params;
    return params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup () {
    if (this._inflate) {
      if (this._inflate[kWriteInProgress]) {
        this._inflate[kPendingClose] = true;
      } else {
        this._inflate.close();
        this._inflate = null;
      }
    }
    if (this._deflate) {
      if (this._deflate[kWriteInProgress]) {
        this._deflate[kPendingClose] = true;
      } else {
        this._deflate.close();
        this._deflate = null;
      }
    }
  }

  /**
   * Accept extension offer from client.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer (paramsList) {
    const accepted = {};
    const result = paramsList.some((params) => {
      if (
        (this._options.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (this._options.serverMaxWindowBits === false &&
          params.server_max_window_bits) ||
        (typeof this._options.serverMaxWindowBits === 'number' &&
          typeof params.server_max_window_bits === 'number' &&
          this._options.serverMaxWindowBits > params.server_max_window_bits) ||
        (typeof this._options.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return;
      }

      if (
        this._options.serverNoContextTakeover ||
        params.server_no_context_takeover
      ) {
        accepted.server_no_context_takeover = true;
      }
      if (
        this._options.clientNoContextTakeover ||
        (this._options.clientNoContextTakeover !== false &&
          params.client_no_context_takeover)
      ) {
        accepted.client_no_context_takeover = true;
      }
      if (typeof this._options.serverMaxWindowBits === 'number') {
        accepted.server_max_window_bits = this._options.serverMaxWindowBits;
      } else if (typeof params.server_max_window_bits === 'number') {
        accepted.server_max_window_bits = params.server_max_window_bits;
      }
      if (typeof this._options.clientMaxWindowBits === 'number') {
        accepted.client_max_window_bits = this._options.clientMaxWindowBits;
      } else if (
        this._options.clientMaxWindowBits !== false &&
        typeof params.client_max_window_bits === 'number'
      ) {
        accepted.client_max_window_bits = params.client_max_window_bits;
      }
      return true;
    });

    if (!result) throw new Error("Doesn't support the offered configuration");

    return accepted;
  }

  /**
   * Accept extension response from server.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient (paramsList) {
    const params = paramsList[0];

    if (
      this._options.clientNoContextTakeover === false &&
      params.client_no_context_takeover
    ) {
      throw new Error('Invalid value for "client_no_context_takeover"');
    }

    if (
      (typeof this._options.clientMaxWindowBits === 'number' &&
        (!params.client_max_window_bits ||
          params.client_max_window_bits > this._options.clientMaxWindowBits)) ||
      (this._options.clientMaxWindowBits === false &&
        params.client_max_window_bits)
    ) {
      throw new Error('Invalid value for "client_max_window_bits"');
    }

    return params;
  }

  /**
   * Normalize extensions parameters.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Array} Normalized extensions parameters
   * @private
   */
  normalizeParams (paramsList) {
    return paramsList.map((params) => {
      Object.keys(params).forEach((key) => {
        var value = params[key];
        if (value.length > 1) {
          throw new Error(`Multiple extension parameters for ${key}`);
        }

        value = value[0];

        switch (key) {
          case 'server_no_context_takeover':
          case 'client_no_context_takeover':
            if (value !== true) {
              throw new Error(`invalid extension parameter value for ${key} (${value})`);
            }
            params[key] = true;
            break;
          case 'server_max_window_bits':
          case 'client_max_window_bits':
            if (typeof value === 'string') {
              value = parseInt(value, 10);
              if (
                Number.isNaN(value) ||
                value < zlib.Z_MIN_WINDOWBITS ||
                value > zlib.Z_MAX_WINDOWBITS
              ) {
                throw new Error(`invalid extension parameter value for ${key} (${value})`);
              }
            }
            if (!this._isServer && value === true) {
              throw new Error(`Missing extension parameter value for ${key}`);
            }
            params[key] = value;
            break;
          default:
            throw new Error(`Not defined extension parameter (${key})`);
        }
      });
      return params;
    });
  }

  /**
   * Decompress data. Concurrency limited by async-limiter.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress (data, fin, callback) {
    zlibLimiter.push((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited by async-limiter.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress (data, fin, callback) {
    zlibLimiter.push((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress (data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits = typeof this.params[key] !== 'number'
        ? zlib.Z_DEFAULT_WINDOWBITS
        : this.params[key];

      this._inflate = zlib.createInflateRaw({ windowBits });
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate[kOwner] = this;
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;
    this._inflate[kWriteInProgress] = true;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = BufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (
        (fin && this.params[`${endpoint}_no_context_takeover`]) ||
        this._inflate[kPendingClose]
      ) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kWriteInProgress] = false;
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress (data, fin, callback) {
    if (!data || data.length === 0) {
      process.nextTick(callback, null, EMPTY_BLOCK);
      return;
    }

    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits = typeof this.params[key] !== 'number'
        ? zlib.Z_DEFAULT_WINDOWBITS
        : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        memLevel: this._options.memLevel,
        level: this._options.level,
        flush: zlib.Z_SYNC_FLUSH,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      //
      // `zlib.DeflateRaw` emits an `'error'` event only when an attempt to use
      // it is made after it has already been closed. This cannot happen here,
      // so we only add a listener for the `'data'` event.
      //
      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kWriteInProgress] = true;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      var data = BufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) data = data.slice(0, data.length - 4);

      if (
        (fin && this.params[`${endpoint}_no_context_takeover`]) ||
        this._deflate[kPendingClose]
      ) {
        this._deflate.close();
        this._deflate = null;
      } else {
        this._deflate[kWriteInProgress] = false;
        this._deflate[kTotalLength] = 0;
        this._deflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }
}

var PerMessageDeflate_1 = PerMessageDeflate;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData (chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData (chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kOwner]._maxPayload < 1 ||
    this[kTotalLength] <= this[kOwner]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError] = new Error('max payload size exceeded');
  this[kError].closeCode = 1009;
  this.removeListener('data', inflateOnData);
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError (err) {
  //
  // There is no need to call `Zlib#close()` as the handle is automatically
  // closed when an error is emitted.
  //
  this[kOwner]._inflate = null;
  this[kCallback](err);
}

/**
 * Class representing an event.
 *
 * @private
 */
class Event$1 {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @param {Object} target A reference to the target to which the event was dispatched
   */
  constructor (type, target) {
    this.target = target;
    this.type = type;
  }
}

/**
 * Class representing a message event.
 *
 * @extends Event
 * @private
 */
class MessageEvent extends Event$1 {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (data, target) {
    super('message', target);

    this.data = data;
  }
}

/**
 * Class representing a close event.
 *
 * @extends Event
 * @private
 */
class CloseEvent extends Event$1 {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {Number} code The status code explaining why the connection is being closed
   * @param {String} reason A human-readable string explaining why the connection is closing
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (code, reason, target) {
    super('close', target);

    this.wasClean = target._closeFrameReceived && target._closeFrameSent;
    this.reason = reason;
    this.code = code;
  }
}

/**
 * Class representing an open event.
 *
 * @extends Event
 * @private
 */
class OpenEvent extends Event$1 {
  /**
   * Create a new `OpenEvent`.
   *
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (target) {
    super('open', target);
  }
}

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} method A string representing the event type to listen for
   * @param {Function} listener The listener to add
   * @public
   */
  addEventListener (method, listener) {
    if (typeof listener !== 'function') return;

    function onMessage (data) {
      listener.call(this, new MessageEvent(data, this));
    }

    function onClose (code, message) {
      listener.call(this, new CloseEvent(code, message, this));
    }

    function onError (event) {
      event.type = 'error';
      event.target = this;
      listener.call(this, event);
    }

    function onOpen () {
      listener.call(this, new OpenEvent(this));
    }

    if (method === 'message') {
      onMessage._listener = listener;
      this.on(method, onMessage);
    } else if (method === 'close') {
      onClose._listener = listener;
      this.on(method, onClose);
    } else if (method === 'error') {
      onError._listener = listener;
      this.on(method, onError);
    } else if (method === 'open') {
      onOpen._listener = listener;
      this.on(method, onOpen);
    } else {
      this.on(method, listener);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} method A string representing the event type to remove
   * @param {Function} listener The listener to remove
   * @public
   */
  removeEventListener (method, listener) {
    const listeners = this.listeners(method);

    for (var i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener || listeners[i]._listener === listener) {
        this.removeListener(method, listeners[i]);
      }
    }
  }
};

var EventTarget_1 = EventTarget;

//
// Allowed token characters:
//
// '!', '#', '$', '%', '&', ''', '*', '+', '-',
// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
//
// tokenChars[32] === 0 // ' '
// tokenChars[33] === 1 // '!'
// tokenChars[34] === 0 // '"'
// ...
//
const tokenChars = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

/**
 * Adds an offer to the map of extension offers or a parameter to the map of
 * parameters.
 *
 * @param {Object} dest The map of extension offers or parameters
 * @param {String} name The extension or parameter name
 * @param {(Object|Boolean|String)} elem The extension parameters or the
 *     parameter value
 * @private
 */
function push (dest, name, elem) {
  if (Object.prototype.hasOwnProperty.call(dest, name)) dest[name].push(elem);
  else dest[name] = [elem];
}

/**
 * Parses the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} header The field value of the header
 * @return {Object} The parsed object
 * @public
 */
function parse$1 (header) {
  const offers = {};

  if (header === undefined || header === '') return offers;

  var params = {};
  var mustUnescape = false;
  var isEscaping = false;
  var inQuotes = false;
  var extensionName;
  var paramName;
  var start = -1;
  var end = -1;

  for (var i = 0; i < header.length; i++) {
    const code = header.charCodeAt(i);

    if (extensionName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20/* ' ' */|| code === 0x09/* '\t' */) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b/* ';' */ || code === 0x2c/* ',' */) {
        if (start === -1) throw new Error(`unexpected character at index ${i}`);

        if (end === -1) end = i;
        const name = header.slice(start, end);
        if (code === 0x2c) {
          push(offers, name, params);
          params = {};
        } else {
          extensionName = name;
        }

        start = end = -1;
      } else {
        throw new Error(`unexpected character at index ${i}`);
      }
    } else if (paramName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 || code === 0x09) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) throw new Error(`unexpected character at index ${i}`);

        if (end === -1) end = i;
        push(params, header.slice(start, end), true);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = {};
          extensionName = undefined;
        }

        start = end = -1;
      } else if (code === 0x3d/* '=' */&& start !== -1 && end === -1) {
        paramName = header.slice(start, i);
        start = end = -1;
      } else {
        throw new Error(`unexpected character at index ${i}`);
      }
    } else {
      //
      // The value of a quoted-string after unescaping must conform to the
      // token ABNF, so only token characters are valid.
      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
      //
      if (isEscaping) {
        if (tokenChars[code] !== 1) {
          throw new Error(`unexpected character at index ${i}`);
        }
        if (start === -1) start = i;
        else if (!mustUnescape) mustUnescape = true;
        isEscaping = false;
      } else if (inQuotes) {
        if (tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (code === 0x22/* '"' */ && start !== -1) {
          inQuotes = false;
          end = i;
        } else if (code === 0x5c/* '\' */) {
          isEscaping = true;
        } else {
          throw new Error(`unexpected character at index ${i}`);
        }
      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
        inQuotes = true;
      } else if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
        if (end === -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) throw new Error(`unexpected character at index ${i}`);

        if (end === -1) end = i;
        var value = header.slice(start, end);
        if (mustUnescape) {
          value = value.replace(/\\/g, '');
          mustUnescape = false;
        }
        push(params, paramName, value);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = {};
          extensionName = undefined;
        }

        paramName = undefined;
        start = end = -1;
      } else {
        throw new Error(`unexpected character at index ${i}`);
      }
    }
  }

  if (start === -1 || inQuotes) throw new Error('unexpected end of input');

  if (end === -1) end = i;
  const token = header.slice(start, end);
  if (extensionName === undefined) {
    push(offers, token, {});
  } else {
    if (paramName === undefined) {
      push(params, token, true);
    } else if (mustUnescape) {
      push(params, paramName, token.replace(/\\/g, ''));
    } else {
      push(params, paramName, token);
    }
    push(offers, extensionName, params);
  }

  return offers;
}

/**
 * Serializes a parsed `Sec-WebSocket-Extensions` header to a string.
 *
 * @param {Object} value The object to format
 * @return {String} A string representing the given value
 * @public
 */
function format (value) {
  return Object.keys(value).map((token) => {
    var paramsList = value[token];
    if (!Array.isArray(paramsList)) paramsList = [paramsList];
    return paramsList.map((params) => {
      return [token].concat(Object.keys(params).map((k) => {
        var p = params[k];
        if (!Array.isArray(p)) p = [p];
        return p.map((v) => v === true ? k : `${k}=${v}`).join('; ');
      })).join('; ');
    }).join(', ');
  }).join(', ');
}

var Extensions = { format, parse: parse$1 };

const Buffer$2 = safeBuffer.Buffer;

var BINARY_TYPES = ['nodebuffer', 'arraybuffer', 'fragments'];
var GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
var EMPTY_BUFFER = Buffer$2.alloc(0);
var NOOP = () => {};

var Constants = {
	BINARY_TYPES: BINARY_TYPES,
	GUID: GUID,
	EMPTY_BUFFER: EMPTY_BUFFER,
	NOOP: NOOP
};

var Validation = createCommonjsModule(function (module) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

try {
  const isValidUTF8 = utf8Validate;

  module.exports = typeof isValidUTF8 === 'object'
    ? isValidUTF8.Validation.isValidUTF8 // utf-8-validate@<3.0.0
    : isValidUTF8;
} catch (e) /* istanbul ignore next */ {
  module.exports = () => true;
}
});

/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var ErrorCodes = {
  isValidErrorCode: function (code) {
    return (code >= 1000 && code <= 1013 && code !== 1004 && code !== 1005 && code !== 1006) ||
      (code >= 3000 && code <= 4999);
  },
  1000: 'normal',
  1001: 'going away',
  1002: 'protocol error',
  1003: 'unsupported data',
  1004: 'reserved',
  1005: 'reserved for extensions',
  1006: 'reserved for extensions',
  1007: 'inconsistent or invalid data',
  1008: 'policy violation',
  1009: 'message too big',
  1010: 'extension handshake missing',
  1011: 'an unexpected condition prevented the request from being fulfilled',
  1012: 'service restart',
  1013: 'try again later'
};

const Buffer$3 = safeBuffer.Buffer;

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
 * HyBi Receiver implementation.
 */
class Receiver {
  /**
   * Creates a Receiver instance.
   *
   * @param {Object} extensions An object containing the negotiated extensions
   * @param {Number} maxPayload The maximum allowed message length
   * @param {String} binaryType The type for binary data
   */
  constructor (extensions, maxPayload, binaryType) {
    this._binaryType = binaryType || Constants.BINARY_TYPES[0];
    this._extensions = extensions || {};
    this._maxPayload = maxPayload | 0;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._mask = null;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._cleanupCallback = null;
    this._hadError = false;
    this._dead = false;
    this._loop = false;

    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.onping = null;
    this.onpong = null;

    this._state = GET_INFO;
  }

  /**
   * Consumes bytes from the available buffered data.
   *
   * @param {Number} bytes The number of bytes to consume
   * @return {Buffer} Consumed bytes
   * @private
   */
  readBuffer (bytes) {
    var offset = 0;
    var dst;
    var l;

    this._bufferedBytes -= bytes;

    if (bytes === this._buffers[0].length) return this._buffers.shift();

    if (bytes < this._buffers[0].length) {
      dst = this._buffers[0].slice(0, bytes);
      this._buffers[0] = this._buffers[0].slice(bytes);
      return dst;
    }

    dst = Buffer$3.allocUnsafe(bytes);

    while (bytes > 0) {
      l = this._buffers[0].length;

      if (bytes >= l) {
        this._buffers[0].copy(dst, offset);
        offset += l;
        this._buffers.shift();
      } else {
        this._buffers[0].copy(dst, offset, 0, bytes);
        this._buffers[0] = this._buffers[0].slice(bytes);
      }

      bytes -= l;
    }

    return dst;
  }

  /**
   * Checks if the number of buffered bytes is bigger or equal than `n` and
   * calls `cleanup` if necessary.
   *
   * @param {Number} n The number of bytes to check against
   * @return {Boolean} `true` if `bufferedBytes >= n`, else `false`
   * @private
   */
  hasBufferedBytes (n) {
    if (this._bufferedBytes >= n) return true;

    this._loop = false;
    if (this._dead) this.cleanup(this._cleanupCallback);
    return false;
  }

  /**
   * Adds new data to the parser.
   *
   * @public
   */
  add (data) {
    if (this._dead) return;

    this._bufferedBytes += data.length;
    this._buffers.push(data);
    this.startLoop();
  }

  /**
   * Starts the parsing loop.
   *
   * @private
   */
  startLoop () {
    this._loop = true;

    while (this._loop) {
      switch (this._state) {
        case GET_INFO:
          this.getInfo();
          break;
        case GET_PAYLOAD_LENGTH_16:
          this.getPayloadLength16();
          break;
        case GET_PAYLOAD_LENGTH_64:
          this.getPayloadLength64();
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          this.getData();
          break;
        default: // `INFLATING`
          this._loop = false;
      }
    }
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @private
   */
  getInfo () {
    if (!this.hasBufferedBytes(2)) return;

    const buf = this.readBuffer(2);

    if ((buf[0] & 0x30) !== 0x00) {
      this.error(new Error('RSV2 and RSV3 must be clear'), 1002);
      return;
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate_1.extensionName]) {
      this.error(new Error('RSV1 must be clear'), 1002);
      return;
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        this.error(new Error('RSV1 must be clear'), 1002);
        return;
      }

      if (!this._fragmented) {
        this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
        return;
      } else {
        this._opcode = this._fragmented;
      }
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
        return;
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        this.error(new Error('FIN must be set'), 1002);
        return;
      }

      if (compressed) {
        this.error(new Error('RSV1 must be clear'), 1002);
        return;
      }

      if (this._payloadLength > 0x7d) {
        this.error(new Error('invalid payload length'), 1002);
        return;
      }
    } else {
      this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
      return;
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;

    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else this.haveLength();
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @private
   */
  getPayloadLength16 () {
    if (!this.hasBufferedBytes(2)) return;

    this._payloadLength = this.readBuffer(2).readUInt16BE(0, true);
    this.haveLength();
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @private
   */
  getPayloadLength64 () {
    if (!this.hasBufferedBytes(8)) return;

    const buf = this.readBuffer(8);
    const num = buf.readUInt32BE(0, true);

    //
    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
    // if payload length is greater than this number.
    //
    if (num > Math.pow(2, 53 - 32) - 1) {
      this.error(new Error('max payload size exceeded'), 1009);
      return;
    }

    this._payloadLength = (num * Math.pow(2, 32)) + buf.readUInt32BE(4, true);
    this.haveLength();
  }

  /**
   * Payload length has been read.
   *
   * @private
   */
  haveLength () {
    if (this._opcode < 0x08 && this.maxPayloadExceeded(this._payloadLength)) {
      return;
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask () {
    if (!this.hasBufferedBytes(4)) return;

    this._mask = this.readBuffer(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @private
   */
  getData () {
    var data = Constants.EMPTY_BUFFER;

    if (this._payloadLength) {
      if (!this.hasBufferedBytes(this._payloadLength)) return;

      data = this.readBuffer(this._payloadLength);
      if (this._masked) BufferUtil.unmask(data, this._mask);
    }

    if (this._opcode > 0x07) {
      this.controlMessage(data);
    } else if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data);
    } else if (this.pushFragment(data)) {
      this.dataMessage();
    }
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @private
   */
  decompress (data) {
    const perMessageDeflate = this._extensions[PerMessageDeflate_1.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) {
        this.error(err, err.closeCode === 1009 ? 1009 : 1007);
        return;
      }

      if (this.pushFragment(buf)) this.dataMessage();
      this.startLoop();
    });
  }

  /**
   * Handles a data message.
   *
   * @private
   */
  dataMessage () {
    if (this._fin) {
      const messageLength = this._messageLength;
      const fragments = this._fragments;

      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];

      if (this._opcode === 2) {
        var data;

        if (this._binaryType === 'nodebuffer') {
          data = toBuffer(fragments, messageLength);
        } else if (this._binaryType === 'arraybuffer') {
          data = toArrayBuffer(toBuffer(fragments, messageLength));
        } else {
          data = fragments;
        }

        this.onmessage(data);
      } else {
        const buf = toBuffer(fragments, messageLength);

        if (!Validation(buf)) {
          this.error(new Error('invalid utf8 sequence'), 1007);
          return;
        }

        this.onmessage(buf.toString());
      }
    }

    this._state = GET_INFO;
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @private
   */
  controlMessage (data) {
    if (this._opcode === 0x08) {
      if (data.length === 0) {
        this.onclose(1000, '');
        this._loop = false;
        this.cleanup(this._cleanupCallback);
      } else if (data.length === 1) {
        this.error(new Error('invalid payload length'), 1002);
      } else {
        const code = data.readUInt16BE(0, true);

        if (!ErrorCodes.isValidErrorCode(code)) {
          this.error(new Error(`invalid status code: ${code}`), 1002);
          return;
        }

        const buf = data.slice(2);

        if (!Validation(buf)) {
          this.error(new Error('invalid utf8 sequence'), 1007);
          return;
        }

        this.onclose(code, buf.toString());
        this._loop = false;
        this.cleanup(this._cleanupCallback);
      }

      return;
    }

    if (this._opcode === 0x09) this.onping(data);
    else this.onpong(data);

    this._state = GET_INFO;
  }

  /**
   * Handles an error.
   *
   * @param {Error} err The error
   * @param {Number} code Close code
   * @private
   */
  error (err, code) {
    this.onerror(err, code);
    this._hadError = true;
    this._loop = false;
    this.cleanup(this._cleanupCallback);
  }

  /**
   * Checks payload size, disconnects socket when it exceeds `maxPayload`.
   *
   * @param {Number} length Payload length
   * @private
   */
  maxPayloadExceeded (length) {
    if (length === 0 || this._maxPayload < 1) return false;

    const fullLength = this._totalPayloadLength + length;

    if (fullLength <= this._maxPayload) {
      this._totalPayloadLength = fullLength;
      return false;
    }

    this.error(new Error('max payload size exceeded'), 1009);
    return true;
  }

  /**
   * Appends a fragment in the fragments array after checking that the sum of
   * fragment lengths does not exceed `maxPayload`.
   *
   * @param {Buffer} fragment The fragment to add
   * @return {Boolean} `true` if `maxPayload` is not exceeded, else `false`
   * @private
   */
  pushFragment (fragment) {
    if (fragment.length === 0) return true;

    const totalLength = this._messageLength + fragment.length;

    if (this._maxPayload < 1 || totalLength <= this._maxPayload) {
      this._messageLength = totalLength;
      this._fragments.push(fragment);
      return true;
    }

    this.error(new Error('max payload size exceeded'), 1009);
    return false;
  }

  /**
   * Releases resources used by the receiver.
   *
   * @param {Function} cb Callback
   * @public
   */
  cleanup (cb) {
    this._dead = true;

    if (!this._hadError && (this._loop || this._state === INFLATING)) {
      this._cleanupCallback = cb;
    } else {
      this._extensions = null;
      this._fragments = null;
      this._buffers = null;
      this._mask = null;

      this._cleanupCallback = null;
      this.onmessage = null;
      this.onclose = null;
      this.onerror = null;
      this.onping = null;
      this.onpong = null;

      if (cb) cb();
    }
  }
}

var Receiver_1 = Receiver;

/**
 * Makes a buffer from a list of fragments.
 *
 * @param {Buffer[]} fragments The list of fragments composing the message
 * @param {Number} messageLength The length of the message
 * @return {Buffer}
 * @private
 */
function toBuffer (fragments, messageLength) {
  if (fragments.length === 1) return fragments[0];
  if (fragments.length > 1) return BufferUtil.concat(fragments, messageLength);
  return Constants.EMPTY_BUFFER;
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 */
function toArrayBuffer (buf) {
  if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

const Buffer$4 = safeBuffer.Buffer;

/**
 * HyBi Sender implementation.
 */
class Sender {
  /**
   * Creates a Sender instance.
   *
   * @param {net.Socket} socket The connection socket
   * @param {Object} extensions An object containing the negotiated extensions
   */
  constructor (socket, extensions) {
    this._extensions = extensions || {};
    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._deflating = false;
    this._queue = [];
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {Buffer} data The data to frame
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @return {Buffer[]} The framed data as a list of `Buffer` instances
   * @public
   */
  static frame (data, options) {
    const merge = data.length < 1024 || (options.mask && options.readOnly);
    var offset = options.mask ? 6 : 2;
    var payloadLength = data.length;

    if (data.length >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (data.length > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer$4.allocUnsafe(merge ? data.length + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    if (payloadLength === 126) {
      target.writeUInt16BE(data.length, 2, true);
    } else if (payloadLength === 127) {
      target.writeUInt32BE(0, 2, true);
      target.writeUInt32BE(data.length, 6, true);
    }

    if (!options.mask) {
      target[1] = payloadLength;
      if (merge) {
        data.copy(target, offset);
        return [target];
      }

      return [target, data];
    }

    const mask = crypto.randomBytes(4);

    target[1] = payloadLength | 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (merge) {
      BufferUtil.mask(data, mask, target, offset, data.length);
      return [target];
    }

    BufferUtil.mask(data, mask, data, 0, data.length);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {(Number|undefined)} code The status code component of the body
   * @param {String} data The message component of the body
   * @param {Boolean} mask Specifies whether or not to mask the message
   * @param {Function} cb Callback
   * @public
   */
  close (code, data, mask, cb) {
    var buf;

    if (code === undefined) {
      code = 1000;
    } else if (typeof code !== 'number' || !ErrorCodes.isValidErrorCode(code)) {
      throw new Error('first argument must be a valid error code number');
    }

    if (data === undefined || data === '') {
      if (code === 1000) {
        buf = Constants.EMPTY_BUFFER;
      } else {
        buf = Buffer$4.allocUnsafe(2);
        buf.writeUInt16BE(code, 0, true);
      }
    } else {
      buf = Buffer$4.allocUnsafe(2 + Buffer$4.byteLength(data));
      buf.writeUInt16BE(code, 0, true);
      buf.write(data, 2);
    }

    if (this._deflating) {
      this.enqueue([this.doClose, buf, mask, cb]);
    } else {
      this.doClose(buf, mask, cb);
    }
  }

  /**
   * Frames and sends a close message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @private
   */
  doClose (data, mask, cb) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x08,
      mask,
      readOnly: false
    }), cb);
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @public
   */
  ping (data, mask) {
    var readOnly = true;

    if (!Buffer$4.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer$4.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer$4.from(data);
        readOnly = false;
      }
    }

    if (this._deflating) {
      this.enqueue([this.doPing, data, mask, readOnly]);
    } else {
      this.doPing(data, mask, readOnly);
    }
  }

  /**
   * Frames and sends a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @private
   */
  doPing (data, mask, readOnly) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x09,
      mask,
      readOnly
    }));
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @public
   */
  pong (data, mask) {
    var readOnly = true;

    if (!Buffer$4.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer$4.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer$4.from(data);
        readOnly = false;
      }
    }

    if (this._deflating) {
      this.enqueue([this.doPong, data, mask, readOnly]);
    } else {
      this.doPong(data, mask, readOnly);
    }
  }

  /**
   * Frames and sends a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @private
   */
  doPong (data, mask, readOnly) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x0a,
      mask,
      readOnly
    }));
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  send (data, options, cb) {
    var opcode = options.binary ? 2 : 1;
    var rsv1 = options.compress;
    var readOnly = true;

    if (!Buffer$4.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer$4.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer$4.from(data);
        readOnly = false;
      }
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate_1.extensionName];

    if (this._firstFragment) {
      this._firstFragment = false;
      if (rsv1 && perMessageDeflate) {
        rsv1 = data.length >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    if (perMessageDeflate) {
      const opts = {
        fin: options.fin,
        rsv1,
        opcode,
        mask: options.mask,
        readOnly
      };

      if (this._deflating) {
        this.enqueue([this.dispatch, data, this._compress, opts, cb]);
      } else {
        this.dispatch(data, this._compress, opts, cb);
      }
    } else {
      this.sendFrame(Sender.frame(data, {
        fin: options.fin,
        rsv1: false,
        opcode,
        mask: options.mask,
        readOnly
      }), cb);
    }
  }

  /**
   * Dispatches a data message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} compress Specifies whether or not to compress `data`
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @param {Function} cb Callback
   * @private
   */
  dispatch (data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate_1.extensionName];

    this._deflating = true;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      options.readOnly = false;
      this.sendFrame(Sender.frame(buf, options), cb);
      this._deflating = false;
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue () {
    while (!this._deflating && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[1].length;
      params[0].apply(this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue (params) {
    this._bufferedBytes += params[1].length;
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} cb Callback
   * @private
   */
  sendFrame (list, cb) {
    if (list.length === 2) {
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

var Sender_1 = Sender;

/**
 * Converts an `ArrayBuffer` view into a buffer.
 *
 * @param {(DataView|TypedArray)} view The view to convert
 * @return {Buffer} Converted view
 * @private
 */
function viewToBuffer (view) {
  const buf = Buffer$4.from(view.buffer);

  if (view.byteLength !== view.buffer.byteLength) {
    return buf.slice(view.byteOffset, view.byteOffset + view.byteLength);
  }

  return buf;
}

const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000; // Allow 30 seconds to terminate the connection cleanly.

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket extends events {
  /**
   * Create a new `WebSocket`.
   *
   * @param {String} address The URL to which to connect
   * @param {(String|String[])} protocols The subprotocols
   * @param {Object} options Connection options
   */
  constructor (address, protocols, options) {
    super();

    if (!protocols) {
      protocols = [];
    } else if (typeof protocols === 'string') {
      protocols = [protocols];
    } else if (!Array.isArray(protocols)) {
      options = protocols;
      protocols = [];
    }

    this.readyState = WebSocket.CONNECTING;
    this.bytesReceived = 0;
    this.extensions = {};
    this.protocol = '';

    this._binaryType = Constants.BINARY_TYPES[0];
    this._finalize = this.finalize.bind(this);
    this._closeFrameReceived = false;
    this._closeFrameSent = false;
    this._closeMessage = '';
    this._closeTimer = null;
    this._finalized = false;
    this._closeCode = 1006;
    this._receiver = null;
    this._sender = null;
    this._socket = null;
    this._ultron = null;

    if (Array.isArray(address)) {
      initAsServerClient.call(this, address[0], address[1], options);
    } else {
      initAsClient.call(this, address, protocols, options);
    }
  }

  get CONNECTING () { return WebSocket.CONNECTING; }
  get CLOSING () { return WebSocket.CLOSING; }
  get CLOSED () { return WebSocket.CLOSED; }
  get OPEN () { return WebSocket.OPEN; }

  /**
   * @type {Number}
   */
  get bufferedAmount () {
    var amount = 0;

    if (this._socket) {
      amount = this._socket.bufferSize + this._sender._bufferedBytes;
    }
    return amount;
  }

  /**
   * This deviates from the WHATWG interface since ws doesn't support the required
   * default "blob" type (instead we define a custom "nodebuffer" type).
   *
   * @type {String}
   */
  get binaryType () {
    return this._binaryType;
  }

  set binaryType (type) {
    if (Constants.BINARY_TYPES.indexOf(type) < 0) return;

    this._binaryType = type;

    //
    // Allow to change `binaryType` on the fly.
    //
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @private
   */
  setSocket (socket, head) {
    socket.setTimeout(0);
    socket.setNoDelay();

    this._receiver = new Receiver_1(this.extensions, this._maxPayload, this.binaryType);
    this._sender = new Sender_1(socket, this.extensions);
    this._ultron = new ultron(socket);
    this._socket = socket;

    this._ultron.on('close', this._finalize);
    this._ultron.on('error', this._finalize);
    this._ultron.on('end', this._finalize);

    if (head.length > 0) socket.unshift(head);

    this._ultron.on('data', (data) => {
      this.bytesReceived += data.length;
      this._receiver.add(data);
    });

    this._receiver.onmessage = (data) => this.emit('message', data);
    this._receiver.onping = (data) => {
      this.pong(data, !this._isServer, true);
      this.emit('ping', data);
    };
    this._receiver.onpong = (data) => this.emit('pong', data);
    this._receiver.onclose = (code, reason) => {
      this._closeFrameReceived = true;
      this._closeMessage = reason;
      this._closeCode = code;
      if (!this._finalized) this.close(code, reason);
    };
    this._receiver.onerror = (error, code) => {
      this._closeMessage = '';
      this._closeCode = code;

      //
      // Ensure that the error is emitted even if `WebSocket#finalize()` has
      // already been called.
      //
      this.readyState = WebSocket.CLOSING;
      this.emit('error', error);
      this.finalize(true);
    };

    this.readyState = WebSocket.OPEN;
    this.emit('open');
  }

  /**
   * Clean up and release internal resources.
   *
   * @param {(Boolean|Error)} error Indicates whether or not an error occurred
   * @private
   */
  finalize (error) {
    if (this._finalized) return;

    this.readyState = WebSocket.CLOSING;
    this._finalized = true;

    if (typeof error === 'object') this.emit('error', error);
    if (!this._socket) return this.emitClose();

    clearTimeout(this._closeTimer);
    this._closeTimer = null;

    this._ultron.destroy();
    this._ultron = null;

    this._socket.on('error', Constants.NOOP);

    if (!error) this._socket.end();
    else this._socket.destroy();

    this._socket = null;
    this._sender = null;

    this._receiver.cleanup(() => this.emitClose());
    this._receiver = null;
  }

  /**
   * Emit the `close` event.
   *
   * @private
   */
  emitClose () {
    this.readyState = WebSocket.CLOSED;

    this.emit('close', this._closeCode, this._closeMessage);

    if (this.extensions[PerMessageDeflate_1.extensionName]) {
      this.extensions[PerMessageDeflate_1.extensionName].cleanup();
    }

    this.extensions = null;

    this.removeAllListeners();
  }

  /**
   * Pause the socket stream.
   *
   * @public
   */
  pause () {
    if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

    this._socket.pause();
  }

  /**
   * Resume the socket stream
   *
   * @public
   */
  resume () {
    if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

    this._socket.resume();
  }

  /**
   * Start a closing handshake.
   *
   *            +----------+     +-----------+   +----------+
   *     + - - -|ws.close()|---->|close frame|-->|ws.close()|- - - -
   *            +----------+     +-----------+   +----------+       |
   *     |      +----------+     +-----------+         |
   *            |ws.close()|<----|close frame|<--------+            |
   *            +----------+     +-----------+         |
   *  CLOSING         |              +---+             |         CLOSING
   *                  |          +---|fin|<------------+
   *     |            |          |   +---+                          |
   *                  |          |   +---+      +-------------+
   *     |            +----------+-->|fin|----->|ws.finalize()| - - +
   *                             |   +---+      +-------------+
   *     |     +-------------+   |
   *      - - -|ws.finalize()|<--+
   *           +-------------+
   *
   * @param {Number} code Status code explaining why the connection is closing
   * @param {String} data A string explaining why the connection is closing
   * @public
   */
  close (code, data) {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      this._req.abort();
      this.finalize(new Error('closed before the connection is established'));
      return;
    }

    if (this.readyState === WebSocket.CLOSING) {
      if (this._closeFrameSent && this._closeFrameReceived) this._socket.end();
      return;
    }

    this.readyState = WebSocket.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      //
      // This error is handled by the `'error'` listener on the socket. We only
      // want to know if the close frame has been sent here.
      //
      if (err) return;

      this._closeFrameSent = true;

      if (!this._finalized) {
        if (this._closeFrameReceived) this._socket.end();

        //
        // Ensure that the connection is cleaned up even when the closing
        // handshake fails.
        //
        this._closeTimer = setTimeout(this._finalize, closeTimeout, true);
      }
    });
  }

  /**
   * Send a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Boolean} failSilently Indicates whether or not to throw if `readyState` isn't `OPEN`
   * @public
   */
  ping (data, mask, failSilently) {
    if (this.readyState !== WebSocket.OPEN) {
      if (failSilently) return;
      throw new Error('not opened');
    }

    if (typeof data === 'number') data = data.toString();
    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || Constants.EMPTY_BUFFER, mask);
  }

  /**
   * Send a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Boolean} failSilently Indicates whether or not to throw if `readyState` isn't `OPEN`
   * @public
   */
  pong (data, mask, failSilently) {
    if (this.readyState !== WebSocket.OPEN) {
      if (failSilently) return;
      throw new Error('not opened');
    }

    if (typeof data === 'number') data = data.toString();
    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || Constants.EMPTY_BUFFER, mask);
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback which is executed when data is written out
   * @public
   */
  send (data, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (this.readyState !== WebSocket.OPEN) {
      if (cb) cb(new Error('not opened'));
      else throw new Error('not opened');
      return;
    }

    if (typeof data === 'number') data = data.toString();

    const opts = Object.assign({
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true
    }, options);

    if (!this.extensions[PerMessageDeflate_1.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || Constants.EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate () {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      this._req.abort();
      this.finalize(new Error('closed before the connection is established'));
      return;
    }

    this.finalize(true);
  }
}

WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    /**
     * Return the listener of the event.
     *
     * @return {(Function|undefined)} The event listener or `undefined`
     * @public
     */
    get () {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) return listeners[i]._listener;
      }
    },
    /**
     * Add a listener for the event.
     *
     * @param {Function} listener The listener to add
     * @public
     */
    set (listener) {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        //
        // Remove only the listeners added via `addEventListener`.
        //
        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
      }
      this.addEventListener(method, listener);
    }
  });
});

WebSocket.prototype.addEventListener = EventTarget_1.addEventListener;
WebSocket.prototype.removeEventListener = EventTarget_1.removeEventListener;

var WebSocket_1 = WebSocket;

/**
 * Initialize a WebSocket server client.
 *
 * @param {http.IncomingMessage} req The request object
 * @param {net.Socket} socket The network socket between the server and client
 * @param {Buffer} head The first packet of the upgraded stream
 * @param {Object} options WebSocket attributes
 * @param {Number} options.protocolVersion The WebSocket protocol version
 * @param {Object} options.extensions The negotiated extensions
 * @param {Number} options.maxPayload The maximum allowed message size
 * @param {String} options.protocol The chosen subprotocol
 * @private
 */
function initAsServerClient (socket, head, options) {
  this.protocolVersion = options.protocolVersion;
  this._maxPayload = options.maxPayload;
  this.extensions = options.extensions;
  this.protocol = options.protocol;

  this._isServer = true;

  this.setSocket(socket, head);
}

/**
 * Initialize a WebSocket client.
 *
 * @param {String} address The URL to which to connect
 * @param {String[]} protocols The list of subprotocols
 * @param {Object} options Connection options
 * @param {String} options.protocol Value of the `Sec-WebSocket-Protocol` header
 * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
 * @param {Number} options.handshakeTimeout Timeout in milliseconds for the handshake request
 * @param {String} options.localAddress Local interface to bind for network connections
 * @param {Number} options.protocolVersion Value of the `Sec-WebSocket-Version` header
 * @param {Object} options.headers An object containing request headers
 * @param {String} options.origin Value of the `Origin` or `Sec-WebSocket-Origin` header
 * @param {http.Agent} options.agent Use the specified Agent
 * @param {String} options.host Value of the `Host` header
 * @param {Number} options.family IP address family to use during hostname lookup (4 or 6).
 * @param {Function} options.checkServerIdentity A function to validate the server hostname
 * @param {Boolean} options.rejectUnauthorized Verify or not the server certificate
 * @param {String} options.passphrase The passphrase for the private key or pfx
 * @param {String} options.ciphers The ciphers to use or exclude
 * @param {String} options.ecdhCurve The curves for ECDH key agreement to use or exclude
 * @param {(String|String[]|Buffer|Buffer[])} options.cert The certificate key
 * @param {(String|String[]|Buffer|Buffer[])} options.key The private key
 * @param {(String|Buffer)} options.pfx The private key, certificate, and CA certs
 * @param {(String|String[]|Buffer|Buffer[])} options.ca Trusted certificates
 * @private
 */
function initAsClient (address, protocols, options) {
  options = Object.assign({
    protocolVersion: protocolVersions[1],
    protocol: protocols.join(','),
    perMessageDeflate: true,
    handshakeTimeout: null,
    localAddress: null,
    headers: null,
    family: null,
    origin: null,
    agent: null,
    host: null,

    //
    // SSL options.
    //
    checkServerIdentity: null,
    rejectUnauthorized: null,
    passphrase: null,
    ciphers: null,
    ecdhCurve: null,
    cert: null,
    key: null,
    pfx: null,
    ca: null
  }, options);

  if (protocolVersions.indexOf(options.protocolVersion) === -1) {
    throw new Error(
      `unsupported protocol version: ${options.protocolVersion} ` +
      `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  this.protocolVersion = options.protocolVersion;
  this._isServer = false;
  this.url = address;

  const serverUrl = url.parse(address);
  const isUnixSocket = serverUrl.protocol === 'ws+unix:';

  if (!serverUrl.host && (!isUnixSocket || !serverUrl.path)) {
    throw new Error('invalid url');
  }

  const isSecure = serverUrl.protocol === 'wss:' || serverUrl.protocol === 'https:';
  const key = crypto.randomBytes(16).toString('base64');
  const httpObj = isSecure ? https : http;
  var perMessageDeflate;

  const requestOptions = {
    port: serverUrl.port || (isSecure ? 443 : 80),
    host: serverUrl.hostname,
    path: '/',
    headers: {
      'Sec-WebSocket-Version': options.protocolVersion,
      'Sec-WebSocket-Key': key,
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };

  if (options.headers) Object.assign(requestOptions.headers, options.headers);
  if (options.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate_1(
      options.perMessageDeflate !== true ? options.perMessageDeflate : {},
      false
    );
    requestOptions.headers['Sec-WebSocket-Extensions'] = Extensions.format({
      [PerMessageDeflate_1.extensionName]: perMessageDeflate.offer()
    });
  }
  if (options.protocol) {
    requestOptions.headers['Sec-WebSocket-Protocol'] = options.protocol;
  }
  if (options.origin) {
    if (options.protocolVersion < 13) {
      requestOptions.headers['Sec-WebSocket-Origin'] = options.origin;
    } else {
      requestOptions.headers.Origin = options.origin;
    }
  }
  if (options.host) requestOptions.headers.Host = options.host;
  if (serverUrl.auth) requestOptions.auth = serverUrl.auth;

  if (options.localAddress) requestOptions.localAddress = options.localAddress;
  if (options.family) requestOptions.family = options.family;

  if (isUnixSocket) {
    const parts = serverUrl.path.split(':');

    requestOptions.socketPath = parts[0];
    requestOptions.path = parts[1];
  } else if (serverUrl.path) {
    //
    // Make sure that path starts with `/`.
    //
    if (serverUrl.path.charAt(0) !== '/') {
      requestOptions.path = `/${serverUrl.path}`;
    } else {
      requestOptions.path = serverUrl.path;
    }
  }

  var agent = options.agent;

  //
  // A custom agent is required for these options.
  //
  if (
    options.rejectUnauthorized != null ||
    options.checkServerIdentity ||
    options.passphrase ||
    options.ciphers ||
    options.ecdhCurve ||
    options.cert ||
    options.key ||
    options.pfx ||
    options.ca
  ) {
    if (options.passphrase) requestOptions.passphrase = options.passphrase;
    if (options.ciphers) requestOptions.ciphers = options.ciphers;
    if (options.ecdhCurve) requestOptions.ecdhCurve = options.ecdhCurve;
    if (options.cert) requestOptions.cert = options.cert;
    if (options.key) requestOptions.key = options.key;
    if (options.pfx) requestOptions.pfx = options.pfx;
    if (options.ca) requestOptions.ca = options.ca;
    if (options.checkServerIdentity) {
      requestOptions.checkServerIdentity = options.checkServerIdentity;
    }
    if (options.rejectUnauthorized != null) {
      requestOptions.rejectUnauthorized = options.rejectUnauthorized;
    }

    if (!agent) agent = new httpObj.Agent(requestOptions);
  }

  if (agent) requestOptions.agent = agent;

  this._req = httpObj.get(requestOptions);

  if (options.handshakeTimeout) {
    this._req.setTimeout(options.handshakeTimeout, () => {
      this._req.abort();
      this.finalize(new Error('opening handshake has timed out'));
    });
  }

  this._req.on('error', (error) => {
    if (this._req.aborted) return;

    this._req = null;
    this.finalize(error);
  });

  this._req.on('response', (res) => {
    if (!this.emit('unexpected-response', this._req, res)) {
      this._req.abort();
      this.finalize(new Error(`unexpected server response (${res.statusCode})`));
    }
  });

  this._req.on('upgrade', (res, socket, head) => {
    this.emit('headers', res.headers, res);

    //
    // The user may have closed the connection from a listener of the `headers`
    // event.
    //
    if (this.readyState !== WebSocket.CONNECTING) return;

    this._req = null;

    const digest = crypto.createHash('sha1')
      .update(key + Constants.GUID, 'binary')
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      socket.destroy();
      return this.finalize(new Error('invalid server key'));
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    const protList = (options.protocol || '').split(/, */);
    var protError;

    if (!options.protocol && serverProt) {
      protError = 'server sent a subprotocol even though none requested';
    } else if (options.protocol && !serverProt) {
      protError = 'server sent no subprotocol even though requested';
    } else if (serverProt && protList.indexOf(serverProt) === -1) {
      protError = 'server responded with an invalid protocol';
    }

    if (protError) {
      socket.destroy();
      return this.finalize(new Error(protError));
    }

    if (serverProt) this.protocol = serverProt;

    if (perMessageDeflate) {
      try {
        const serverExtensions = Extensions.parse(
          res.headers['sec-websocket-extensions']
        );

        if (serverExtensions[PerMessageDeflate_1.extensionName]) {
          perMessageDeflate.accept(
            serverExtensions[PerMessageDeflate_1.extensionName]
          );
          this.extensions[PerMessageDeflate_1.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        socket.destroy();
        this.finalize(new Error('invalid Sec-WebSocket-Extensions header'));
        return;
      }
    }

    this.setSocket(socket, head);
  });
}

const Buffer$5 = safeBuffer.Buffer;

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends events {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {String} options.host The hostname where to bind the server
   * @param {Number} options.port The port where to bind the server
   * @param {http.Server} options.server A pre-created HTTP/S server to use
   * @param {Function} options.verifyClient An hook to reject connections
   * @param {Function} options.handleProtocols An hook to handle protocols
   * @param {String} options.path Accept only connections matching this path
   * @param {Boolean} options.noServer Enable no server mode
   * @param {Boolean} options.clientTracking Specifies whether or not to track clients
   * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
   * @param {Number} options.maxPayload The maximum allowed message size
   * @param {Function} callback A listener for the `listening` event
   */
  constructor (options, callback) {
    super();

    options = Object.assign({
      maxPayload: 100 * 1024 * 1024,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null
    }, options);

    if (options.port == null && !options.server && !options.noServer) {
      throw new TypeError('missing or invalid options');
    }

    if (options.port != null) {
      this._server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.listen(options.port, options.host, options.backlog, callback);
    } else if (options.server) {
      this._server = options.server;
    }

    if (this._server) {
      this._ultron = new ultron(this._server);
      this._ultron.on('listening', () => this.emit('listening'));
      this._ultron.on('error', (err) => this.emit('error', err));
      this._ultron.on('upgrade', (req, socket, head) => {
        this.handleUpgrade(req, socket, head, (client) => {
          this.emit('connection', client, req);
        });
      });
    }

    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
    if (options.clientTracking) this.clients = new Set();
    this.options = options;
  }

  /**
   * Close the server.
   *
   * @param {Function} cb Callback
   * @public
   */
  close (cb) {
    //
    // Terminate all associated clients.
    //
    if (this.clients) {
      for (const client of this.clients) client.terminate();
    }

    const server = this._server;

    if (server) {
      this._ultron.destroy();
      this._ultron = this._server = null;

      //
      // Close the http server if it was internally created.
      //
      if (this.options.port != null) return server.close(cb);
    }

    if (cb) cb();
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle (req) {
    if (this.options.path && url.parse(req.url).pathname !== this.options.path) {
      return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade (req, socket, head, cb) {
    socket.on('error', socketError);

    const version = +req.headers['sec-websocket-version'];
    const extensions = {};

    if (
      req.method !== 'GET' || req.headers.upgrade.toLowerCase() !== 'websocket' ||
      !req.headers['sec-websocket-key'] || (version !== 8 && version !== 13) ||
      !this.shouldHandle(req)
    ) {
      return abortConnection(socket, 400);
    }

    if (this.options.perMessageDeflate) {
      const perMessageDeflate = new PerMessageDeflate_1(
        this.options.perMessageDeflate,
        true,
        this.options.maxPayload
      );

      try {
        const offers = Extensions.parse(
          req.headers['sec-websocket-extensions']
        );

        if (offers[PerMessageDeflate_1.extensionName]) {
          perMessageDeflate.accept(offers[PerMessageDeflate_1.extensionName]);
          extensions[PerMessageDeflate_1.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        return abortConnection(socket, 400);
      }
    }

    var protocol = (req.headers['sec-websocket-protocol'] || '').split(/, */);

    //
    // Optionally call external protocol selection handler.
    //
    if (this.options.handleProtocols) {
      protocol = this.options.handleProtocols(protocol, req);
      if (protocol === false) return abortConnection(socket, 401);
    } else {
      protocol = protocol[0];
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin: req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.connection.authorized || req.connection.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message) => {
          if (!verified) return abortConnection(socket, code || 401, message);

          this.completeUpgrade(
            protocol,
            extensions,
            version,
            req,
            socket,
            head,
            cb
          );
        });
        return;
      }

      if (!this.options.verifyClient(info)) return abortConnection(socket, 401);
    }

    this.completeUpgrade(protocol, extensions, version, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {String} protocol The chosen subprotocol
   * @param {Object} extensions The accepted extensions
   * @param {Number} version The WebSocket protocol version
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @private
   */
  completeUpgrade (protocol, extensions, version, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    const key = crypto.createHash('sha1')
      .update(req.headers['sec-websocket-key'] + Constants.GUID, 'binary')
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`
    ];

    if (protocol) headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
    if (extensions[PerMessageDeflate_1.extensionName]) {
      const params = extensions[PerMessageDeflate_1.extensionName].params;
      const value = Extensions.format({
        [PerMessageDeflate_1.extensionName]: [params]
      });
      headers.push(`Sec-WebSocket-Extensions: ${value}`);
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('\r\n').join('\r\n'));

    const client = new WebSocket_1([socket, head], null, {
      maxPayload: this.options.maxPayload,
      protocolVersion: version,
      extensions,
      protocol
    });

    if (this.clients) {
      this.clients.add(client);
      client.on('close', () => this.clients.delete(client));
    }

    socket.removeListener('error', socketError);
    cb(client);
  }
}

var WebSocketServer_1 = WebSocketServer;

/**
 * Handle premature socket errors.
 *
 * @private
 */
function socketError () {
  this.destroy();
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {net.Socket} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @private
 */
function abortConnection (socket, code, message) {
  if (socket.writable) {
    message = message || http.STATUS_CODES[code];
    socket.write(
      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
      'Connection: close\r\n' +
      'Content-type: text/html\r\n' +
      `Content-Length: ${Buffer$5.byteLength(message)}\r\n` +
      '\r\n' +
      message
    );
  }

  socket.removeListener('error', socketError);
  socket.destroy();
}

WebSocket_1.Server = WebSocketServer_1;
WebSocket_1.Receiver = Receiver_1;
WebSocket_1.Sender = Sender_1;

var ws = WebSocket_1;

/**
 * Module dependencies.
 */






var debug$9 = src$4('engine.io-client:websocket');
var BrowserWebSocket = commonjsGlobal.WebSocket || commonjsGlobal.MozWebSocket;
var NodeWebSocket;
if (typeof window === 'undefined') {
  try {
    NodeWebSocket = ws;
  } catch (e) { }
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocket$2 = BrowserWebSocket;
if (!WebSocket$2 && typeof window === 'undefined') {
  WebSocket$2 = NodeWebSocket;
}

/**
 * Module exports.
 */

var websocket = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  this.protocols = opts.protocols;
  if (!this.usingBrowserWebSocket) {
    WebSocket$2 = NodeWebSocket;
  }
  transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

componentInherit(WS, transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws = this.usingBrowserWebSocket ? (protocols ? new WebSocket$2(uri, protocols) : new WebSocket$2(uri)) : new WebSocket$2(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      lib.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? commonjsGlobal.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug$9('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done () {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
    ('ws' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast_1();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocket$2 && !('__initialize' in WebSocket$2 && this.name === WS.prototype.name);
};

/**
 * Module dependencies
 */






/**
 * Export transports.
 */

var polling_1 = polling$2;
var websocket_1 = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling$2 (opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (commonjsGlobal.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest_1(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new pollingXhr(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new pollingJsonp(opts);
  }
}

var transports = {
	polling: polling_1,
	websocket: websocket_1
};

var indexOf = [].indexOf;

var indexof = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/**
 * Module dependencies.
 */



var debug$10 = src$4('engine.io-client:socket');





/**
 * Module exports.
 */

var socket = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket (uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure
    : (commonjsGlobal.location && 'https:' === location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (commonjsGlobal.location ? location.hostname : 'localhost');
  this.port = opts.port || (commonjsGlobal.location && location.port
      ? location.port
      : (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.transportOptions = opts.transportOptions || {};
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // other options for Node.js client
  var freeGlobal = typeof commonjsGlobal === 'object' && commonjsGlobal;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

componentEmitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = lib.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = transport;
Socket.transports = transports;
Socket.parser = lib;

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug$10('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = lib.protocol;

  // transport name
  query.transport = name;

  // per-transport options
  var options = this.transportOptions[name] || {};

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport$$1 = new transports[name]({
    query: query,
    socket: this,
    agent: options.agent || this.agent,
    hostname: options.hostname || this.hostname,
    port: options.port || this.port,
    secure: options.secure || this.secure,
    path: options.path || this.path,
    forceJSONP: options.forceJSONP || this.forceJSONP,
    jsonp: options.jsonp || this.jsonp,
    forceBase64: options.forceBase64 || this.forceBase64,
    enablesXDR: options.enablesXDR || this.enablesXDR,
    timestampRequests: options.timestampRequests || this.timestampRequests,
    timestampParam: options.timestampParam || this.timestampParam,
    policyPort: options.policyPort || this.policyPort,
    pfx: options.pfx || this.pfx,
    key: options.key || this.key,
    passphrase: options.passphrase || this.passphrase,
    cert: options.cert || this.cert,
    ca: options.ca || this.ca,
    ciphers: options.ciphers || this.ciphers,
    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: options.extraHeaders || this.extraHeaders,
    forceNode: options.forceNode || this.forceNode,
    localAddress: options.localAddress || this.localAddress,
    requestTimeout: options.requestTimeout || this.requestTimeout,
    protocols: options.protocols || void (0)
  });

  return transport$$1;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport$$1;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport$$1 = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport$$1 = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport$$1 = this.createTransport(transport$$1);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport$$1.open();
  this.setTransport(transport$$1);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport$$1) {
  debug$10('setting transport %s', transport$$1.name);
  var self = this;

  if (this.transport) {
    debug$10('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport$$1;

  // set up transport listeners
  transport$$1
  .on('drain', function () {
    self.onDrain();
  })
  .on('packet', function (packet) {
    self.onPacket(packet);
  })
  .on('error', function (e) {
    self.onError(e);
  })
  .on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug$10('probing transport "%s"', name);
  var transport$$1 = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen () {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug$10('probe transport "%s" opened', name);
    transport$$1.send([{ type: 'ping', data: 'probe' }]);
    transport$$1.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug$10('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport$$1);
        if (!transport$$1) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport$$1.name;

        debug$10('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug$10('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport$$1);
          transport$$1.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport$$1);
          transport$$1 = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug$10('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport$$1.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport () {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport$$1.close();
    transport$$1 = null;
  }

  // Handle any error that happens while probing
  function onerror (err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport$$1.name;

    freezeTransport();

    debug$10('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose () {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose () {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade (to) {
    if (transport$$1 && to.name !== transport$$1.name) {
      debug$10('"%s" works - aborting "%s"', to.name, transport$$1.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup () {
    transport$$1.removeListener('open', onTransportOpen);
    transport$$1.removeListener('error', onerror);
    transport$$1.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport$$1.once('open', onTransportOpen);
  transport$$1.once('error', onerror);
  transport$$1.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport$$1.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug$10('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug$10('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState ||
      'closing' === this.readyState) {
    debug$10('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(JSON.parse(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug$10('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug$10('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug$10('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close () {
    self.onClose('forced close');
    debug$10('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose () {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade () {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug$10('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug$10('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~indexof(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

var lib$2 = socket;

/**
 * Exports parser
 *
 * @api public
 *
 */
var parser$1 = lib;

lib$2.parser = parser$1;

var toArray_1 = toArray;

function toArray(list, index) {
    var array = [];

    index = index || 0;

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i];
    }

    return array
}

/**
 * Module exports.
 */

var on_1 = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on (obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function () {
      obj.removeListener(ev, fn);
    }
  };
}

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

var componentBind = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

var socket$2 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */






var debug = src('socket.io-client:socket');



/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events$$1 = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = componentEmitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket (io, nsp, opts) {
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  this.flags = {};
  if (opts && opts.query) {
    this.query = opts.query;
  }
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

componentEmitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function () {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on_1(io, 'open', componentBind(this, 'onopen')),
    on_1(io, 'packet', componentBind(this, 'onpacket')),
    on_1(io, 'close', componentBind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function () {
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' === this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function () {
  var args = toArray_1(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function (ev) {
  if (events$$1.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray_1(arguments);
  var packet = {
    type: (this.flags.binary !== undefined ? this.flags.binary : hasBinary2(args)) ? socket_ioParser.BINARY_EVENT : socket_ioParser.EVENT,
    data: args
  };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' === typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  this.flags = {};

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function (packet) {
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function () {
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' !== this.nsp) {
    if (this.query) {
      var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
      debug('sending connect packet with query %s', query);
      this.packet({type: socket_ioParser.CONNECT, query: query});
    } else {
      this.packet({type: socket_ioParser.CONNECT});
    }
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function (reason) {
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function (packet) {
  if (packet.nsp !== this.nsp) return;

  switch (packet.type) {
    case socket_ioParser.CONNECT:
      this.onconnect();
      break;

    case socket_ioParser.EVENT:
      this.onevent(packet);
      break;

    case socket_ioParser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case socket_ioParser.ACK:
      this.onack(packet);
      break;

    case socket_ioParser.BINARY_ACK:
      this.onack(packet);
      break;

    case socket_ioParser.DISCONNECT:
      this.ondisconnect();
      break;

    case socket_ioParser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function (packet) {
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function (id) {
  var self = this;
  var sent = false;
  return function () {
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray_1(arguments);
    debug('sending ack %j', args);

    self.packet({
      type: hasBinary2(args) ? socket_ioParser.BINARY_ACK : socket_ioParser.ACK,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function (packet) {
  var ack = this.acks[packet.id];
  if ('function' === typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function () {
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function () {
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function () {
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function () {
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function () {
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: socket_ioParser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function (compress) {
  this.flags.compress = compress;
  return this;
};

/**
 * Sets the binary flag
 *
 * @param {Boolean} whether the emitted data contains binary
 * @return {Socket} self
 * @api public
 */

Socket.prototype.binary = function (binary) {
  this.flags.binary = binary;
  return this;
};
});

/**
 * Expose `Backoff`.
 */

var backo2 = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};

/**
 * Module dependencies.
 */







var debug$11 = src('socket.io-client:manager');



/**
 * IE6+ hasOwnProperty
 */

var has$2 = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

var manager = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager (uri, opts) {
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' === typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new backo2({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  var _parser = opts.parser || socket_ioParser;
  this.encoder = new _parser.Encoder();
  this.decoder = new _parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function () {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has$2.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function () {
  for (var nsp in this.nsps) {
    if (has$2.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.generateId(nsp);
    }
  }
};

/**
 * generate `socket.id` for the given `nsp`
 *
 * @param {String} nsp
 * @return {String}
 * @api private
 */

Manager.prototype.generateId = function (nsp) {
  return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
};

/**
 * Mix in `Emitter`.
 */

componentEmitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function (v) {
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function (v) {
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function (v) {
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function (v) {
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function (v) {
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function (v) {
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function () {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};

/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function (fn, opts) {
  debug$11('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug$11('opening %s', this.uri);
  this.engine = lib$2(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on_1(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on_1(socket, 'error', function (data) {
    debug$11('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug$11('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function () {
      debug$11('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function () {
  debug$11('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on_1(socket, 'data', componentBind(this, 'ondata')));
  this.subs.push(on_1(socket, 'ping', componentBind(this, 'onping')));
  this.subs.push(on_1(socket, 'pong', componentBind(this, 'onpong')));
  this.subs.push(on_1(socket, 'error', componentBind(this, 'onerror')));
  this.subs.push(on_1(socket, 'close', componentBind(this, 'onclose')));
  this.subs.push(on_1(this.decoder, 'decoded', componentBind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function () {
  this.lastPing = new Date();
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function () {
  this.emitAll('pong', new Date() - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function (data) {
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function (err) {
  debug$11('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function (nsp, opts) {
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new socket$2(this, nsp, opts);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function () {
      socket.id = self.generateId(nsp);
    });

    if (this.autoConnect) {
      // manually call here since connecting event is fired before listening
      onConnecting();
    }
  }

  function onConnecting () {
    if (!~indexof(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function (socket) {
  var index = indexof(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function (packet) {
  debug$11('writing packet %j', packet);
  var self = this;
  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function (encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function () {
  debug$11('cleanup');

  var subsLength = this.subs.length;
  for (var i = 0; i < subsLength; i++) {
    var sub = this.subs.shift();
    sub.destroy();
  }

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function () {
  debug$11('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' === this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function (reason) {
  debug$11('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function () {
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug$11('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug$11('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function () {
      if (self.skipReconnect) return;

      debug$11('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function (err) {
        if (err) {
          debug$11('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug$11('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function () {
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};

var lib$4 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




var debug = src('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup (uri, opts) {
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url_1(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path$$1 = parsed.path;
  var sameNamespace = cache[id] && path$$1 in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = socket_ioParser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = manager;
exports.Socket = socket$2;
});

var lib_1$1 = lib$4.managers;
var lib_2$1 = lib$4.protocol;
var lib_3$1 = lib$4.connect;
var lib_4$1 = lib$4.Manager;
var lib_5$1 = lib$4.Socket;

var bind$1 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
var isBuffer_1 = function (obj) {
  return obj != null && (isBuffer$2(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
};

function isBuffer$2 (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer$2(obj.slice(0, 0))
}

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString$5 = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray$2(val) {
  return toString$5.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString$5.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject$1(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString$5.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString$5.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString$5.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString$5.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject$1(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray$2(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var utils = {
  isArray: isArray$2,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer_1,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject$1,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

function encode$2(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url$$1, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url$$1;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode$2(key) + '=' + encode$2(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url$$1 += (url$$1.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url$$1;
};

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var isURLSameOrigin = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url$$1) {
      var href = url$$1;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

var btoa_1 = btoa;

var cookies = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path$$1, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path$$1)) {
          cookie.push('path=' + path$$1);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

var btoa$1 = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || btoa_1;

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa$1(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies$$1 = cookies;

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies$$1.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

var debug$12 = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms$$1 = curr - (prevTime || curr);
    self.diff = ms$$1;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});

var debug_1$3 = debug$12.coerce;
var debug_2$3 = debug$12.disable;
var debug_3$3 = debug$12.enable;
var debug_4$3 = debug$12.enabled;
var debug_5$3 = debug$12.humanize;
var debug_6$3 = debug$12.instances;
var debug_7$3 = debug$12.names;
var debug_8$3 = debug$12.skips;
var debug_9$3 = debug$12.formatters;

var browser$6 = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug$12;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});

var browser_1$3 = browser$6.log;
var browser_2$3 = browser$6.formatArgs;
var browser_3$3 = browser$6.save;
var browser_4$3 = browser$6.load;
var browser_5$3 = browser$6.useColors;
var browser_6$3 = browser$6.storage;
var browser_7$3 = browser$6.colors;

var node$6 = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug$12;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor$$1 = supportsColor;
  if (supportsColor$$1 && supportsColor$$1.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});

var node_1$3 = node$6.init;
var node_2$3 = node$6.log;
var node_3$3 = node$6.formatArgs;
var node_4$3 = node$6.save;
var node_5$3 = node$6.load;
var node_6$3 = node$6.useColors;
var node_7$3 = node$6.colors;
var node_8$3 = node$6.inspectOpts;

var src$6 = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = browser$6;
} else {
  module.exports = node$6;
}
});

var followRedirects = createCommonjsModule(function (module) {
var Writable = require$$0.Writable;
var debug = src$6('follow-redirects');

var nativeProtocols = {'http:': http, 'https:': https};
var schemes = {};
var exports = module.exports = {
	maxRedirects: 21
};
// RFC7231§4.2.1: Of the request methods defined by this specification,
// the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
var safeMethods = {GET: true, HEAD: true, OPTIONS: true, TRACE: true};

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
['abort', 'aborted', 'error', 'socket'].forEach(function (event) {
	eventHandlers[event] = function (arg) {
		this._redirectable.emit(event, arg);
	};
});

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
	// Initialize the request
	Writable.call(this);
	this._options = options;
	this._redirectCount = 0;
	this._bufferedWrites = [];

	// Attach a callback if passed
	if (responseCallback) {
		this.on('response', responseCallback);
	}

	// React to responses of native requests
	var self = this;
	this._onNativeResponse = function (response) {
		self._processResponse(response);
	};

	// Complete the URL object when necessary
	if (!options.pathname && options.path) {
		var searchPos = options.path.indexOf('?');
		if (searchPos < 0) {
			options.pathname = options.path;
		} else {
			options.pathname = options.path.substring(0, searchPos);
			options.search = options.path.substring(searchPos);
		}
	}

	// Perform the first request
	this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
	// If specified, use the agent corresponding to the protocol
	// (HTTP and HTTPS use different types of agents)
	var protocol = this._options.protocol;
	if (this._options.agents) {
		this._options.agent = this._options.agents[schemes[protocol]];
	}

	// Create the native request
	var nativeProtocol = nativeProtocols[protocol];
	var request = this._currentRequest =
				nativeProtocol.request(this._options, this._onNativeResponse);
	this._currentUrl = url.format(this._options);

	// Set up event handlers
	request._redirectable = this;
	for (var event in eventHandlers) {
		/* istanbul ignore else */
		if (event) {
			request.on(event, eventHandlers[event]);
		}
	}

	// End a redirected request
	// (The first request must be ended explicitly with RedirectableRequest#end)
	if (this._isRedirect) {
		// If the request doesn't have en entity, end directly.
		var bufferedWrites = this._bufferedWrites;
		if (bufferedWrites.length === 0) {
			request.end();
		// Otherwise, write the request entity and end afterwards.
		} else {
			var i = 0;
			(function writeNext() {
				if (i < bufferedWrites.length) {
					var bufferedWrite = bufferedWrites[i++];
					request.write(bufferedWrite.data, bufferedWrite.encoding, writeNext);
				} else {
					request.end();
				}
			})();
		}
	}
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
	// RFC7231§6.4: The 3xx (Redirection) class of status code indicates
	// that further action needs to be taken by the user agent in order to
	// fulfill the request. If a Location header field is provided,
	// the user agent MAY automatically redirect its request to the URI
	// referenced by the Location field value,
	// even if the specific status code is not understood.
	var location = response.headers.location;
	if (location && this._options.followRedirects !== false &&
			response.statusCode >= 300 && response.statusCode < 400) {
		// RFC7231§6.4: A client SHOULD detect and intervene
		// in cyclical redirections (i.e., "infinite" redirection loops).
		if (++this._redirectCount > this._options.maxRedirects) {
			return this.emit('error', new Error('Max redirects exceeded.'));
		}

		// RFC7231§6.4: Automatic redirection needs to done with
		// care for methods not known to be safe […],
		// since the user might not wish to redirect an unsafe request.
		// RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
		// that the target resource resides temporarily under a different URI
		// and the user agent MUST NOT change the request method
		// if it performs an automatic redirection to that URI.
		var header;
		var headers = this._options.headers;
		if (response.statusCode !== 307 && !(this._options.method in safeMethods)) {
			this._options.method = 'GET';
			// Drop a possible entity and headers related to it
			this._bufferedWrites = [];
			for (header in headers) {
				if (/^content-/i.test(header)) {
					delete headers[header];
				}
			}
		}

		// Drop the Host header, as the redirect might lead to a different host
		if (!this._isRedirect) {
			for (header in headers) {
				if (/^host$/i.test(header)) {
					delete headers[header];
				}
			}
		}

		// Perform the redirected request
		var redirectUrl = url.resolve(this._currentUrl, location);
		debug('redirecting to', redirectUrl);
		Object.assign(this._options, url.parse(redirectUrl));
		this._isRedirect = true;
		this._performRequest();
	} else {
		// The response is not a redirect; return it as-is
		response.responseUrl = this._currentUrl;
		this.emit('response', response);

		// Clean up
		delete this._options;
		delete this._bufferedWrites;
	}
};

// Aborts the current native request
RedirectableRequest.prototype.abort = function () {
	this._currentRequest.abort();
};

// Flushes the headers of the current native request
RedirectableRequest.prototype.flushHeaders = function () {
	this._currentRequest.flushHeaders();
};

// Sets the noDelay option of the current native request
RedirectableRequest.prototype.setNoDelay = function (noDelay) {
	this._currentRequest.setNoDelay(noDelay);
};

// Sets the socketKeepAlive option of the current native request
RedirectableRequest.prototype.setSocketKeepAlive = function (enable, initialDelay) {
	this._currentRequest.setSocketKeepAlive(enable, initialDelay);
};

// Sets the timeout option of the current native request
RedirectableRequest.prototype.setTimeout = function (timeout, callback) {
	this._currentRequest.setTimeout(timeout, callback);
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
	this._currentRequest.write(data, encoding, callback);
	this._bufferedWrites.push({data: data, encoding: encoding});
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
	this._currentRequest.end(data, encoding, callback);
	if (data) {
		this._bufferedWrites.push({data: data, encoding: encoding});
	}
};

// Export a redirecting wrapper for each native protocol
Object.keys(nativeProtocols).forEach(function (protocol) {
	var scheme = schemes[protocol] = protocol.substr(0, protocol.length - 1);
	var nativeProtocol = nativeProtocols[protocol];
	var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

	// Executes an HTTP request, following redirects
	wrappedProtocol.request = function (options, callback) {
		if (typeof options === 'string') {
			options = url.parse(options);
			options.maxRedirects = exports.maxRedirects;
		} else {
			options = Object.assign({
				maxRedirects: exports.maxRedirects,
				protocol: protocol
			}, options);
		}
		assert.equal(options.protocol, protocol, 'protocol mismatch');
		debug('options', options);

		return new RedirectableRequest(options, callback);
	};

	// Executes a GET request, following redirects
	wrappedProtocol.get = function (options, callback) {
		var request = wrappedProtocol.request(options, callback);
		request.end();
		return request;
	};
});
});

var followRedirects_1 = followRedirects.maxRedirects;

var _from = "axios";
var _id = "axios@0.17.1";
var _inBundle = false;
var _integrity = "sha1-LY4+XQvb1zJ/kbyBT1xXZg+Bgk0=";
var _location = "/axios";
var _phantomChildren = {};
var _requested = {"type":"tag","registry":true,"raw":"axios","name":"axios","escapedName":"axios","rawSpec":"","saveSpec":null,"fetchSpec":"latest"};
var _requiredBy = ["#USER","/"];
var _resolved = "https://registry.npmjs.org/axios/-/axios-0.17.1.tgz";
var _shasum = "2d8e3e5d0bdbd7327f91bc814f5c57660f81824d";
var _spec = "axios";
var _where = "/home/tang/projects/ZD-SWAG-SDK";
var author = {"name":"Matt Zabriskie"};
var browser$8 = {"./lib/adapters/http.js":"./lib/adapters/xhr.js"};
var bugs = {"url":"https://github.com/axios/axios/issues"};
var bundleDependencies = false;
var bundlesize = [{"path":"./dist/axios.min.js","threshold":"5kB"}];
var dependencies = {"follow-redirects":"^1.2.5","is-buffer":"^1.1.5"};
var deprecated = false;
var description = "Promise based HTTP client for the browser and node.js";
var devDependencies = {"bundlesize":"^0.5.7","coveralls":"^2.11.9","es6-promise":"^4.0.5","grunt":"^1.0.1","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.0.0","grunt-contrib-nodeunit":"^1.0.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^19.0.0","grunt-karma":"^2.0.0","grunt-ts":"^6.0.0-beta.3","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.0.0","karma-coverage":"^1.0.0","karma-firefox-launcher":"^1.0.0","karma-jasmine":"^1.0.2","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-phantomjs-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.1.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","phantomjs-prebuilt":"^2.1.7","sinon":"^1.17.4","typescript":"^2.0.3","url-search-params":"^0.6.1","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"};
var homepage = "https://github.com/axios/axios";
var keywords = ["xhr","http","ajax","promise","node"];
var license = "MIT";
var main = "index.js";
var name = "axios";
var repository = {"type":"git","url":"git+https://github.com/axios/axios.git"};
var scripts = {"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test && bundlesize","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"};
var typings = "./index.d.ts";
var version = "0.17.1";
var _package = {
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_shasum: _shasum,
	_spec: _spec,
	_where: _where,
	author: author,
	browser: browser$8,
	bugs: bugs,
	bundleDependencies: bundleDependencies,
	bundlesize: bundlesize,
	dependencies: dependencies,
	deprecated: deprecated,
	description: description,
	devDependencies: devDependencies,
	homepage: homepage,
	keywords: keywords,
	license: license,
	main: main,
	name: name,
	repository: repository,
	scripts: scripts,
	typings: typings,
	version: version
};

var _package$1 = Object.freeze({
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_shasum: _shasum,
	_spec: _spec,
	_where: _where,
	author: author,
	browser: browser$8,
	bugs: bugs,
	bundleDependencies: bundleDependencies,
	bundlesize: bundlesize,
	dependencies: dependencies,
	deprecated: deprecated,
	description: description,
	devDependencies: devDependencies,
	homepage: homepage,
	keywords: keywords,
	license: license,
	main: main,
	name: name,
	repository: repository,
	scripts: scripts,
	typings: typings,
	version: version,
	default: _package
});

var pkg = ( _package$1 && _package ) || _package$1;

var httpFollow = followRedirects.http;
var httpsFollow = followRedirects.https;






/*eslint consistent-return:0*/
var http_1 = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolve, reject) {
    var data = config.data;
    var headers = config.headers;
    var timer;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = new Buffer(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = new Buffer(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var parsed = url.parse(config.url);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttps = protocol === 'https:';
    var agent = isHttps ? config.httpsAgent : config.httpAgent;

    var options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method,
      headers: headers,
      agent: agent,
      auth: auth
    };

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        proxy = {
          host: parsedProxyUrl.hostname,
          port: parsedProxyUrl.port
        };

        if (parsedProxyUrl.auth) {
          var proxyUrlAuth = parsedProxyUrl.auth.split(':');
          proxy.auth = {
            username: proxyUrlAuth[0],
            password: proxyUrlAuth[1]
          };
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = new Buffer(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttps ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttps ? httpsFollow : httpFollow;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // Response has been received so kill timer that handles request timeout
      clearTimeout(timer);
      timer = null;

      // uncompress the response body transparently if required
      var stream = res;
      switch (res.headers['content-encoding']) {
      /*eslint default-case:0*/
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream = stream.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString('utf8');
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout && !timer) {
      timer = setTimeout(function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      }, config.timeout);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = http_1;
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults;

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL = function isAbsoluteURL(url$$1) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url$$1);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults_1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults_1, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url$$1, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url$$1
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url$$1, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url$$1,
      data: data
    }));
  };
});

var Axios_1 = Axios;

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind$1(Axios_1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios_1.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults_1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios_1;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults_1, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = Cancel_1;
axios.CancelToken = CancelToken_1;
axios.isCancel = isCancel;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;

var axios_1 = axios;

// Allow use of default import syntax in TypeScript
var default_1 = axios;

axios_1.default = default_1;

var axios$1 = axios_1;

// 20.2.2.34 Math.trunc(x)


_export(_export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

var trunc = _core.Math.trunc;

var trunc$2 = createCommonjsModule(function (module) {
module.exports = { "default": trunc, __esModule: true };
});

var _Math$trunc = unwrapExports(trunc$2);

var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

_export(_export.S + _export.F * !_iterDetect(function (iter) {  }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from = _core.Array.from;

var from$2 = createCommonjsModule(function (module) {
module.exports = { "default": from, __esModule: true };
});

var _Array$from = unwrapExports(from$2);

var canDPI = {
  /**
   * Verify if a can msg match the signature
   * @param {Object} canmsg
   * @param {number[]} canmsg.DATA
   * @param {string} signature 
   * @returns {boolean} tell whether can msg match the signature
   */
  verify: function verify(canmsg, signature) {
    var sigArr = void 0;
    if (signature.startsWith('0b')) {
      // parse signature as binary string
      sigArr = signature.substring(2).match(/.{8}/g);
      sigArr = sigArr.map(function (elem) {
        return parseInt(elem, 2);
      });
    } else if (signature.startsWith('0x')) {
      // parse signature as hex string
      sigArr = signature.substring(2).match(/.{2}/g);
      sigArr = sigArr.map(function (elem) {
        return parseInt(elem, 16);
      });
    } else {
      return false;
    }

    var DATA = canmsg.DATA;

    return DATA.every(function (elem, idx) {
      return (elem & sigArr[idx]) === sigArr[idx];
    });
  },

  /**
   * Parse a canmsg data matching signature
   * @param {Object} canmsg
   * @param {number[]} canmsg.DATA
   * @param {string} signature
   * @param {Object[]} params
   * @returns {Object[]} param name with value
   */
  parse: function parse(canmsg, signature, params) {
    if (!this.verify(canmsg, signature)) return [];

    var DATA = _Array$from(canmsg.DATA).reverse();
    var ret = [];
    params.forEach(function (param) {
      var pos = param.pos,
          len = param.len,
          name = param.name;
      // calc bit pos -> bytes pos

      var bytePos = _Math$trunc(pos / 8);
      var bitInByte = pos % 8;
      var restLen = len;
      var val = 0;
      var valLen = 0;
      while (restLen > 0) {
        var currLen = 8 - bitInByte;
        if (currLen >= restLen) {
          var mask = Math.pow(2, restLen) - 1;
          val += (DATA[bytePos] & mask) << valLen;
          break;
        } else {
          val += DATA[bytePos] >> bitInByte << valLen;
          restLen -= currLen;
          valLen += currLen;
          bytePos += 1;
          bitInByte = 0;
        }
      }
      ret.push({
        name: name,
        val: val
      });
    });

    return ret;
  }
};

var TraceServer = function () {
  function TraceServer(option) {
    _classCallCheck(this, TraceServer);

    option = option || {};
    this.port = option.port || 6001;
    this.host = option.host || 'localhost';
    this.subscribeMap = {};
  }

  _createClass(TraceServer, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        _this.socket = lib$4.connect('http://' + _this.host + ':' + _this.port + '/');
        _this.socket.on('connect', function () {
          resolve(1);
          _this.socketId = _this.socket.id;
          _this.socket.emit('identity', 'remote');
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
        });
        _this.socket.on('connect_error', function () {
          reject('connect_error');
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
          delete _this.socket;
        });
      });
    }
  }, {
    key: 'getDuration',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.socket) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/duration');

              case 4:
                return _context.abrupt('return', _context.sent.data);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getDuration() {
        return _ref.apply(this, arguments);
      }

      return getDuration;
    }()
  }, {
    key: 'pull',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(start, end, modules) {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.socket) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context2.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/trace', {
                  params: {
                    duration: [start, end],
                    modules: modules
                  }
                });

              case 4:
                return _context2.abrupt('return', _context2.sent.data);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function pull(_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return pull;
    }()
  }, {
    key: 'hook',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(eventName, type, filterString) {
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.socket) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context3.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/hook', {
                  id: this.socketId,
                  eventName: eventName,
                  filterString: filterString,
                  type: type
                });

              case 4:
                return _context3.abrupt('return', _context3.sent);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function hook(_x4, _x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return hook;
    }()
  }, {
    key: 'removeHook',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(eventName) {
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.socket) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context4.next = 4;
                return axios$1.delete('http://' + this.host + ':' + this.port + '/hook', {
                  params: {
                    id: this.socketId,
                    eventName: eventName
                  }
                });

              case 4:
                return _context4.abrupt('return', _context4.sent);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function removeHook(_x7) {
        return _ref4.apply(this, arguments);
      }

      return removeHook;
    }()

    /**
     * assert a CAN message on success or on failed
     * @param {Object} option
     * @param {string} option.signature string with '0x' or '0b'
     * @param {number} option.timeout default 5000, max waiting time for matching can msg
     * @param {boolean} option.onFailed when to trigger callback, true means on failed, false means on success
     */

  }, {
    key: 'assertCAN',
    value: function assertCAN(option) {
      var _this2 = this;

      return new _Promise(function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(resolve, reject) {
          var hookName, timer, duration, now, checkBeginTime, beforeCANs, foundBeforeCAN;
          return regenerator.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (_this2.socket) {
                    _context5.next = 3;
                    break;
                  }

                  reject(1);
                  return _context5.abrupt('return');

                case 3:
                  hookName = 'assert-can-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                  // set timeout event

                  timer = setTimeout(function () {
                    if (!option.onFailed) reject(2);else resolve(1);
                    _this2.socket.removeAllListeners(hookName);
                    _this2.removeHook(hookName);
                  }, option.timeout || 5000);

                  // set a hook

                  _context5.next = 7;
                  return _this2.hook(hookName, '{"protocol" = "CAN"}');

                case 7:
                  _this2.socket.once(hookName, function (trace) {
                    if (canDPI.verify(trace.data, option.signature)) {
                      if (!option.onFailed) resolve(trace);else reject(2);
                      clearTimeout(timer);
                      _this2.removeHook(hookName);
                    }
                  });

                  _context5.next = 10;
                  return _this2.getDuration();

                case 10:
                  duration = _context5.sent;
                  now = duration.end;
                  checkBeginTime = now - 5000; // check from 5000ms before now

                  _context5.next = 15;
                  return _this2.pull(checkBeginTime, now, ['can']);

                case 15:
                  beforeCANs = _context5.sent;
                  foundBeforeCAN = beforeCANs.find(function (can) {
                    return canDPI.verify(can.data.canmsg, option.signature);
                  });

                  if (!foundBeforeCAN) {
                    _context5.next = 23;
                    break;
                  }

                  // found a matching CAN msg
                  if (!option.onFailed) resolve(foundBeforeCAN);else reject(2);
                  _this2.socket.removeAllListeners(hookName);
                  clearTimeout(timer);
                  _this2.removeHook(hookName);
                  return _context5.abrupt('return');

                case 23:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this2);
        }));

        return function (_x8, _x9) {
          return _ref5.apply(this, arguments);
        };
      }());
    }

    /**
     * assert a eso keyword on success or on failed 
     * @param {Object} option
     * @param {string} option.channelID
     * @param {String} option.keyword
     * @param {number} option.timeout default 20000, max waiting time for matching can msg
     * @param {boolean} option.onFailed when to trigger callback, true means on failed, false means on success
     */

  }, {
    key: 'assertESOTrace',
    value: function assertESOTrace(option) {
      var _this3 = this;

      return new _Promise(function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(resolve, reject) {
          var hookName, timer, duration, now, checkBeginTime, beforeESOs, foundBeforeESO;
          return regenerator.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (_this3.socket) {
                    _context6.next = 3;
                    break;
                  }

                  reject('connect_error');
                  return _context6.abrupt('return');

                case 3:
                  hookName = crypto.createHash('md5').update(_JSON$stringify(option)).digest('hex');
                  // set time out event

                  timer = setTimeout(function () {
                    _this3.socket.removeAllListeners(hookName);
                    _this3.removeHook(hookName).then(function () {
                      if (!option.onFailed) resolve({
                        res: false,
                        trace: ''
                      });else resolve({
                        res: true,
                        trace: ''
                      });
                    });
                  }, option.timeout || 20000);

                  // set a hook

                  _context6.next = 7;
                  return _this3.hook(hookName, 'ESO', '{"esotext"=="' + option.keyword + '"}');

                case 7:
                  // && {"esoclid"=="${option.channelID}"}`)
                  //console.log('waiting for hook')
                  _this3.socket.on(hookName, function (trace) {
                    //data.data.msgData
                    // { size: 97,
                    //   id: 4,
                    //   data: 
                    //    { timeStamp: 4660142,
                    //      modifiers: 0,
                    //      channelId: 10847,
                    //      threadId: 7939,
                    //      level: 'INFO',
                    //      msgType: 'STRING_UTF8',
                    //      size: 70,
                    //      msgData: ' ~Dispatcher-HMIEvent~[ScreenChangeManager#showScreen] screenID=100137' } }        
                    if (!option.onFailed) resolve({
                      res: true,
                      trace: trace
                    });else resolve({
                      res: false
                    });
                    clearTimeout(timer);
                    _this3.removeHook(hookName);
                  });

                  _context6.next = 10;
                  return _this3.getDuration();

                case 10:
                  duration = _context6.sent;
                  now = duration.end;
                  checkBeginTime = now - 5000; // check from 5000ms before now

                  _context6.next = 15;
                  return _this3.pull(checkBeginTime, now, ['eso']);

                case 15:
                  beforeESOs = _context6.sent;

                  //trace.data.data.channel === eso trace port
                  foundBeforeESO = beforeESOs.find(function (trace) {
                    // (trace.data.data.msgData.data.channelId === option.channelID) &&
                    return trace.data.data.msgData.data.msgData.data && trace.data.data.msgData.data.msgData.data.indexOf(option.keyword) !== -1;
                  });

                  if (!foundBeforeESO) {
                    _context6.next = 23;
                    break;
                  }

                  // found a matching CAN msg
                  if (!option.onFailed) resolve({
                    res: true,
                    trace: foundBeforeESO[0]
                  });else resolve({
                    res: false,
                    trace: foundBeforeESO[0]
                  });
                  _this3.socket.removeAllListeners(hookName);
                  clearTimeout(timer);
                  _this3.removeHook(hookName);
                  return _context6.abrupt('return');

                case 23:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, _this3);
        }));

        return function (_x10, _x11) {
          return _ref6.apply(this, arguments);
        };
      }());
    }

    /**
     * assert multi eso keyword on success
     * @param {Array} optionList  contain a list of assertion
     * @param {Object} option
     * @param {number} option.timeout default 20000, max waiting time for matching can msg
     * @param {string} assertion.channelID
     * @param {String} assertion.keyword
     * @param {boolean} assertion.singleReturn default false, will be resolve true, when singleReturn eso keyword exist. 
     */

  }, {
    key: 'assertMultiESOTraces',
    value: function assertMultiESOTraces(option, assertionList) {
      var _this4 = this;

      return new _Promise(function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8(resolve, reject) {
          var expectedList, timerList, timerMultiESO, duration, now, checkBeginTime, beforeESOs;
          return regenerator.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  if (_this4.socket) {
                    _context8.next = 3;
                    break;
                  }

                  reject('connect_error');
                  return _context8.abrupt('return');

                case 3:
                  expectedList = {};
                  timerList = {};
                  timerMultiESO = setTimeout(function () {
                    //let result = true;
                    for (var i = 0; i < _Object$keys(expectedList).length; i++) {
                      if (expectedList[_Object$keys(expectedList)[i]].onMessage === false) {
                        resolve({
                          res: false,
                          traces: expectedList
                        });
                        return;
                      }
                    }
                    resolve({
                      res: true,
                      successReason: 'all',
                      traces: expectedList
                    });
                  }, option.timeout || 21000);


                  assertionList.forEach(function () {
                    var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(elem) {
                      var hookName, timer;
                      return regenerator.wrap(function _callee7$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              hookName = crypto.createHash('md5').update(_JSON$stringify(elem)).digest('hex');

                              expectedList[hookName] = {
                                onMessage: false,
                                keyword: elem.keyword,
                                trace: '',
                                singleReturn: elem.singleReturn
                              };
                              // set time out event
                              timer = setTimeout(function () {
                                _this4.unsubscribe(hookName);
                                _this4.socket.removeAllListeners(hookName);
                                // this.removeHook(hookName)
                              }, option.timeout || 20000);

                              timerList[hookName] = timer;
                              // set a hook
                              _context7.next = 6;
                              return _this4.subscribe(hookName, 'ESO', '{"esotext"=="' + elem.keyword + '"}');

                            case 6:
                              //await this.hook(hookName, 'ESO', `{"esotext"=="${elem.keyword}"}`) // && {"esoclid"=="${option.channelID}"}`)
                              //console.log('waiting for hook')
                              _this4.socket.once(hookName, function (trace) {
                                //console.log(trace.data.msgData.data.msgData.data);
                                console.log('on event', hookName, elem.singleReturn);
                                expectedList[hookName].onMessage = true;
                                expectedList[hookName].trace = trace.data.msgData.data.msgData.data;
                                clearTimeout(timer);
                                _this4.unsubscribe(hookName);
                                _this4.socket.removeAllListeners(hookName);
                                if (expectedList[hookName].singleReturn) {
                                  resolve({
                                    res: true,
                                    successReason: 'single',
                                    traces: expectedList
                                  });
                                  clearTimeout(timerMultiESO);
                                } else {
                                  var result = true;
                                  for (var i = 0; i < _Object$keys(expectedList).length; i++) {
                                    if (expectedList[_Object$keys(expectedList)[i]].onMessage === false) {
                                      result = false;
                                      break;
                                    }
                                  }
                                  if (result) {
                                    resolve({
                                      res: true,
                                      successReason: 'all',
                                      traces: expectedList
                                    });
                                    clearTimeout(timerMultiESO);
                                  }
                                }
                              });
                              //trace.data.data.channel === eso trace port

                            case 7:
                            case 'end':
                              return _context7.stop();
                          }
                        }
                      }, _callee7, _this4);
                    }));

                    return function (_x14) {
                      return _ref8.apply(this, arguments);
                    };
                  }());
                  _context8.next = 9;
                  return _this4.getDuration();

                case 9:
                  duration = _context8.sent;
                  now = duration.end;
                  checkBeginTime = now - (option.before || 5000); // check from 5000ms before now

                  console.log(duration);
                  console.log('start', checkBeginTime, 'end', now);
                  _context8.next = 16;
                  return _this4.pull(checkBeginTime, now, ['ESO']);

                case 16:
                  beforeESOs = _context8.sent;

                  console.log('length', beforeESOs.length);
                  console.log('first msg', beforeESOs[0].data.data.msgData.data.msgData.data);

                  _Object$keys(expectedList).forEach(function (hookName) {
                    var foundBeforeESO = beforeESOs.find(function (trace) {
                      // (trace.data.data.msgData.data.channelId === option.channelID) &&
                      return trace.data.data.msgData.data.msgData.data && trace.data.data.msgData.data.msgData.data.toUpperCase().indexOf(expectedList[hookName].keyword.toUpperCase()) !== -1;
                    });
                    //console.log(foundBeforeESO)
                    if (foundBeforeESO) {
                      console.log(foundBeforeESO.data.data.msgData.data.msgData.data);
                      expectedList[hookName].onMessage = true;
                      expectedList[hookName].trace = foundBeforeESO.data.data.msgData.data.msgData.data;
                      clearTimeout(timerList[hookName]);
                      _this4.unsubscribe(hookName);
                      _this4.socket.removeAllListeners(hookName);
                      // this.removeHook(hookName)
                      var result = true;
                      for (var i = 0; i < _Object$keys(expectedList).length; i++) {
                        if (expectedList[hookName].singleReturn && expectedList[_Object$keys(expectedList)[i]].onMessage === true) {
                          resolve({
                            res: true,
                            successReason: 'single',
                            traces: expectedList
                          });
                          clearTimeout(timerMultiESO);
                          return;
                        }
                        if (expectedList[_Object$keys(expectedList)[i]].onMessage === false) {
                          result = false;
                          //break;
                        }
                      }
                      if (result) {
                        resolve({
                          res: true,
                          successReason: 'all',
                          traces: expectedList
                        });
                        clearTimeout(timerMultiESO);
                      }
                    }
                  });

                case 20:
                case 'end':
                  return _context8.stop();
              }
            }
          }, _callee8, _this4);
        }));

        return function (_x12, _x13) {
          return _ref7.apply(this, arguments);
        };
      }());
    }

    /**
     * Subscribe a type of trace server message with custom event name
     * @param {String} name subscribed event name on which socket listens
     * @param {String} type subscribed event type, could be one of [CAN, BAP, ESO]
     * @param {String} [filterStr] subscribe additional filter string
     * @returns {boolean} tell whether operation succeed or not, if succeed, listen the event name on this.socket
     */

  }, {
    key: 'subscribe',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee9(name, type, filterStr) {
        return regenerator.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (this.socket) {
                  _context9.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                if (filterStr) {
                  _context9.next = 4;
                  break;
                }

                throw new Error('Missing filter string');

              case 4:
                _context9.next = 6;
                return this.hook(name, type.toUpperCase(), filterStr);

              case 6:
                this.subscribeMap[name] = type;
                return _context9.abrupt('return', true);

              case 8:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function subscribe(_x15, _x16, _x17) {
        return _ref9.apply(this, arguments);
      }

      return subscribe;
    }()

    /**
     * Unsubscribe a event
     * @param {string} name event name to unsubscribe
     */

  }, {
    key: 'unsubscribe',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee10(name) {
        return regenerator.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (this.socket) {
                  _context10.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                if (this.subscribeMap[name]) {
                  _context10.next = 4;
                  break;
                }

                throw new Error('name not exists');

              case 4:
                _context10.next = 6;
                return this.removeHook(name);

              case 6:
                return _context10.abrupt('return', true);

              case 7:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function unsubscribe(_x18) {
        return _ref10.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }, {
    key: 'unsubscribeType',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee11(type) {
        var _this5 = this;

        var foundNames, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name;

        return regenerator.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (this.socket) {
                  _context11.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                foundNames = _Object$keys(this.subscribeMap).filter(function (key) {
                  return _this5.subscribeMap[key] === type;
                });

                if (!foundNames.length) {
                  _context11.next = 30;
                  break;
                }

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context11.prev = 7;
                _iterator = _getIterator(foundNames);

              case 9:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context11.next = 16;
                  break;
                }

                name = _step.value;
                _context11.next = 13;
                return this.removeHook(name);

              case 13:
                _iteratorNormalCompletion = true;
                _context11.next = 9;
                break;

              case 16:
                _context11.next = 22;
                break;

              case 18:
                _context11.prev = 18;
                _context11.t0 = _context11['catch'](7);
                _didIteratorError = true;
                _iteratorError = _context11.t0;

              case 22:
                _context11.prev = 22;
                _context11.prev = 23;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 25:
                _context11.prev = 25;

                if (!_didIteratorError) {
                  _context11.next = 28;
                  break;
                }

                throw _iteratorError;

              case 28:
                return _context11.finish(25);

              case 29:
                return _context11.finish(22);

              case 30:
                return _context11.abrupt('return', true);

              case 31:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[7, 18, 22, 30], [23,, 25, 29]]);
      }));

      function unsubscribeType(_x19) {
        return _ref11.apply(this, arguments);
      }

      return unsubscribeType;
    }()
  }, {
    key: 'setFilter',
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee12(filters) {
        return regenerator.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (this.socket) {
                  _context12.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context12.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/filter', filters);

              case 4:
                return _context12.abrupt('return', _context12.sent);

              case 5:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function setFilter(_x20) {
        return _ref12.apply(this, arguments);
      }

      return setFilter;
    }()
  }, {
    key: 'getFilter',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee13() {
        return regenerator.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (this.socket) {
                  _context13.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context13.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/filter');

              case 4:
                return _context13.abrupt('return', _context13.sent.data);

              case 5:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function getFilter() {
        return _ref13.apply(this, arguments);
      }

      return getFilter;
    }()
  }]);

  return TraceServer;
}();

var tts = function () {
  function TTS(option) {
    _classCallCheck(this, TTS);

    this.option = option;
  }

  // data = {text, voice}


  _createClass(TTS, [{
    key: 'new',
    value: function _new(data, cb) {
      axios$1.post('http://' + this.option.host + ':' + this.option.port + '/tts/model', {
        text: data.text,
        voice: data.voice.toString("base64")
      }).then(function (response) {
        cb(false, response.data);
      }).catch(function (err) {
        cb(true, err);
      });
    }

    // data = {text, voice}

  }, {
    key: 'update',
    value: function update(id, data, cb) {
      axios$1.put('http://' + this.option.host + ':' + this.option.port + '/tts/model/' + id, {
        text: data.text,
        voice: data.voice.toString("base64")
      }).then(function (response) {
        cb(false, response.data);
      }).catch(function (err) {
        cb(true, err);
      });
    }
  }, {
    key: 'delete',
    value: function _delete(id, cb) {
      axios$1.delete('http://' + this.option.host + ':' + this.option.port + '/tts/model/' + id).then(function (response) {
        cb(false, response.data);
      }).catch(function (err) {
        cb(true, err);
      });
    }
  }, {
    key: 'get',
    value: function get(text, cb) {
      axios$1.get('http://' + this.option.host + ':' + this.option.port + '/tts/model/' + text).then(function (response) {
        cb(false, response.data);
      }).catch(function (err) {
        cb(true, err);
      });
    }
  }]);

  return TTS;
}();

var MainUnit = function () {
  function MainUnit(option) {
    _classCallCheck(this, MainUnit);

    option = option || {};
    this.port = option.port || 6009;
    this.host = option.host || 'localhost';
    this.subscribeMap = {};
  }

  _createClass(MainUnit, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        _this.socket = lib$4.connect('http://' + _this.host + ':' + _this.port + '/');
        _this.socket.on('connect', function () {
          resolve(1);
          _this.socket.emit('identity', 'remote');
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
        });
        _this.socket.on('connect_error', function () {
          reject(1);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
          delete _this.socket;
        });
      });
    }

    /**
     * get VIN of MU
     */

  }, {
    key: 'getVIN',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var res;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.socket) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/envstatus/vin');

              case 4:
                res = _context.sent;
                return _context.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getVIN() {
        return _ref.apply(this, arguments);
      }

      return getVIN;
    }()

    /**
     * get backend of MU
     */

  }, {
    key: 'getBackend',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var res;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.socket) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context2.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/envstatus/backend');

              case 4:
                res = _context2.sent;
                return _context2.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getBackend() {
        return _ref2.apply(this, arguments);
      }

      return getBackend;
    }()

    /**
     * trigger MU reset with persistence
     */

  }, {
    key: 'resetWithPersistence',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var res;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.socket) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context3.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/envstatus/resetwithpers', { token: 'resetWithPers' });

              case 4:
                res = _context3.sent;
                return _context3.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function resetWithPersistence() {
        return _ref3.apply(this, arguments);
      }

      return resetWithPersistence;
    }()

    /**
     * set backend of MU
     */

  }, {
    key: 'setBackend',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(backend) {
        var res;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.socket) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context4.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/envstatus/backend', backend);

              case 4:
                res = _context4.sent;
                return _context4.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function setBackend(_x) {
        return _ref4.apply(this, arguments);
      }

      return setBackend;
    }()

    /**
     * fetch files from MU to service folder(remote local)
     */

  }, {
    key: 'fetchFiles',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(serverFile, remoteFolder) {
        var res;
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.socket) {
                  _context5.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context5.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/mu/fetchfiles', { files: serverFile, toPath: remoteFolder });

              case 4:
                res = _context5.sent;
                return _context5.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function fetchFiles(_x2, _x3) {
        return _ref5.apply(this, arguments);
      }

      return fetchFiles;
    }()
  }, {
    key: 'getCurrentScreenID',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6() {
        var res;
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.socket) {
                  _context6.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context6.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/mu/currentscreenid');

              case 4:
                res = _context6.sent;
                return _context6.abrupt('return', res.data.screenID);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getCurrentScreenID() {
        return _ref6.apply(this, arguments);
      }

      return getCurrentScreenID;
    }()
  }, {
    key: 'getStartupTestMode',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7() {
        var res;
        return regenerator.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (this.socket) {
                  _context7.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context7.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/envstatus/startuptestmode');

              case 4:
                res = _context7.sent;
                return _context7.abrupt('return', res.data.state);

              case 6:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getStartupTestMode() {
        return _ref7.apply(this, arguments);
      }

      return getStartupTestMode;
    }()
  }, {
    key: 'setStartupTestMode',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8(state) {
        var res;
        return regenerator.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (this.socket) {
                  _context8.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context8.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/envstatus/startuptestmode', {
                  enable: state
                });

              case 4:
                res = _context8.sent;
                return _context8.abrupt('return', res.data.state);

              case 6:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function setStartupTestMode(_x4) {
        return _ref8.apply(this, arguments);
      }

      return setStartupTestMode;
    }()
  }, {
    key: 'resetEsoToDefault',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee9() {
        var res;
        return regenerator.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (this.socket) {
                  _context9.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context9.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/envstatus/resetesotrace', { token: 'resetEsoTraceDefault' });

              case 4:
                res = _context9.sent;
                return _context9.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function resetEsoToDefault() {
        return _ref9.apply(this, arguments);
      }

      return resetEsoToDefault;
    }()
  }]);

  return MainUnit;
}();

var CANTrace = function () {
  function CANTrace(option) {
    _classCallCheck(this, CANTrace);

    option = option || {};
    this.port = option.port || 6002;
    this.host = option.host || 'localhost';
    this.subscribeMap = {};
  }

  _createClass(CANTrace, [{
    key: 'connect',
    value: function connect(type) {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        _this.socket = lib$4.connect('http://' + _this.host + ':' + _this.port + '/');
        _this.socket.on('connect', function () {
          resolve(1);
          if (type) _this.socket.emit('identity', type);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
        });
        _this.socket.on('connect_error', function () {
          reject(1);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
          delete _this.socket;
        });
      });
    }

    /**
     * send a single canmsg
     */

  }, {
    key: 'sendCANMsg',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(name, canmsg) {
        var res;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.socket) {
                  _context.next = 2;
                  break;
                }

                throw new Error('CAN Trace service not ready');

              case 2:
                _context.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/send', {
                  name: name,
                  canmsg: canmsg
                });

              case 4:
                res = _context.sent;
                return _context.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sendCANMsg(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return sendCANMsg;
    }()

    /**
     * send a group of canmsg in a time sequence
     * @param {Object[]} canmsgs a group of canmsg
     */

  }, {
    key: 'sendMultiCANMsgs',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(canmsgs) {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.socket) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('CAN Trace service not ready');

              case 2:
                _context2.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/send/multi', canmsgs);

              case 4:
                return _context2.abrupt('return', true);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function sendMultiCANMsgs(_x3) {
        return _ref2.apply(this, arguments);
      }

      return sendMultiCANMsgs;
    }()
  }]);

  return CANTrace;
}();

var BAPTrace = function () {
  function BAPTrace(option) {
    _classCallCheck(this, BAPTrace);

    option = option || {};
    this.port = option.port || 6005;
    this.host = option.host || 'localhost';
    this.subscribeMap = {};
  }

  _createClass(BAPTrace, [{
    key: 'connect',
    value: function connect(type) {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        _this.socket = lib$4.connect('http://' + _this.host + ':' + _this.port + '/');
        _this.socket.on('connect', function () {
          resolve(1);
          if (type) _this.socket.emit('identity', type);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
        });
        _this.socket.on('connect_error', function () {
          reject(1);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
          delete _this.socket;
        });
      });
    }
  }, {
    key: 'bap2CAN',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(CANID, LSGID, FCTID, OPCODE, DATA, LEN) {
        var res;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.socket) {
                  _context.next = 2;
                  break;
                }

                throw new Error('BAP Trace service not ready');

              case 2:
                _context.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/converter/bap2can', {
                  CANID: CANID,
                  LSGID: LSGID,
                  FCTID: FCTID,
                  OPCODE: OPCODE,
                  DATA: DATA,
                  LEN: LEN
                });

              case 4:
                res = _context.sent;
                return _context.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function bap2CAN(_x, _x2, _x3, _x4, _x5, _x6) {
        return _ref.apply(this, arguments);
      }

      return bap2CAN;
    }()
  }, {
    key: 'initView',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(fileName) {
        var res;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.socket) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('BAP Trace service not ready');

              case 2:
                _context2.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/bapview/', {
                  fileName: fileName
                });

              case 4:
                res = _context2.sent;
                return _context2.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initView(_x7) {
        return _ref2.apply(this, arguments);
      }

      return initView;
    }()
  }, {
    key: 'uninitView',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var res;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.socket) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('BAP Trace service not ready');

              case 2:
                _context3.next = 4;
                return axios$1.delete('http://' + this.host + ':' + this.port + '/bapview/');

              case 4:
                res = _context3.sent;
                return _context3.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function uninitView() {
        return _ref3.apply(this, arguments);
      }

      return uninitView;
    }()
  }, {
    key: 'getViewState',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
        var res;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.socket) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('BAP Trace service not ready');

              case 2:
                _context4.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/bapview/');

              case 4:
                res = _context4.sent;
                return _context4.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getViewState() {
        return _ref4.apply(this, arguments);
      }

      return getViewState;
    }()
  }, {
    key: 'parseBAP',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(bapmsg) {
        var res;
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.socket) {
                  _context5.next = 2;
                  break;
                }

                throw new Error('BAP Trace service not ready');

              case 2:
                _context5.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/bapview/parse', bapmsg);

              case 4:
                res = _context5.sent;
                return _context5.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function parseBAP(_x8) {
        return _ref5.apply(this, arguments);
      }

      return parseBAP;
    }()
  }]);

  return BAPTrace;
}();

var host = 'locahost';
var port$1 = 6006;

var Remotepanel = {
  set host(val) {
    host = val;
  },
  set port(val) {
    port$1 = val;
  },
  /**
    * call remotePanel
    */
  // keyevent 
  // action:'exe'/'ret'(execute remotepanel / return canmsg)
  // keyid:'ZD_SDS'
  // keyboardid: 'MIB1' / 'MIB2'
  hardkeyReq: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_action, _keyid, _keyboardid) {
      var keyevent, res;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              keyevent = void 0;

              if (!(_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret')) {
                _context.next = 10;
                break;
              }

              _context.t0 = _keyboardid.toLowerCase();
              _context.next = _context.t0 === 'mib1' ? 5 : _context.t0 === 'mib2' ? 7 : 9;
              break;

            case 5:
              keyevent = {
                action: _action,
                event: {
                  keyid: _keyid,
                  keyboardid: 2
                }
              };
              return _context.abrupt('break', 10);

            case 7:
              keyevent = {
                action: _action,
                event: {
                  keyid: _keyid,
                  keyboardid: 1
                }
              };
              return _context.abrupt('break', 10);

            case 9:
              return _context.abrupt('break', 10);

            case 10:
              if (keyevent) {
                _context.next = 12;
                break;
              }

              throw new Error('Unexpected parameters');

            case 12:
              _context.next = 14;
              return axios$1.post('http://' + host + ':' + port$1 + '/remotepanel/key', keyevent);

            case 14:
              res = _context.sent;
              return _context.abrupt('return', res.data);

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function hardkeyReq(_x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    }

    return hardkeyReq;
  }(),

  //touchevent 
  // action:'exe'/'ret'(execute remotepanel / return canmsg)
  // screentype:'top' / 'bottom'
  // x: 200
  // y: 200
  tapReq: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(_action, _screentype, _x, _y) {
      var touchevent, res;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              touchevent = void 0;

              if (!(_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret')) {
                _context2.next = 14;
                break;
              }

              _context2.t0 = _screentype.toLowerCase();
              _context2.next = _context2.t0 === 'top' ? 5 : _context2.t0 === 'upper' ? 7 : _context2.t0 === 'bottom' ? 9 : _context2.t0 === 'lower' ? 11 : 13;
              break;

            case 5:
              touchevent = {
                action: _action,
                event: {
                  screentype: 1,
                  x: _x,
                  y: _y
                }
              };
              return _context2.abrupt('break', 14);

            case 7:
              touchevent = {
                action: _action,
                event: {
                  screentype: 1,
                  x: _x,
                  y: _y
                }
              };
              return _context2.abrupt('break', 14);

            case 9:
              touchevent = {
                action: _action,
                event: {
                  screentype: 2,
                  x: _x,
                  y: _y
                }
              };
              return _context2.abrupt('break', 14);

            case 11:
              touchevent = {
                action: _action,
                event: {
                  screentype: 2,
                  x: _x,
                  y: _y
                }
              };
              return _context2.abrupt('break', 14);

            case 13:
              return _context2.abrupt('break', 14);

            case 14:
              if (touchevent) {
                _context2.next = 16;
                break;
              }

              throw new Error('Unexpected parameters');

            case 16:
              _context2.next = 18;
              return axios$1.post('http://' + host + ':' + port$1 + '/remotepanel/touch', touchevent);

            case 18:
              res = _context2.sent;
              return _context2.abrupt('return', res.data);

            case 20:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function tapReq(_x5, _x6, _x7, _x8) {
      return _ref2.apply(this, arguments);
    }

    return tapReq;
  }(),

  //swipeevent
  // action:'exe'/'ret'(execute remotepanel / return canmsg)
  // screentype:'top' / 'bottom'
  // x: 200
  // y: 200
  // dx: 200
  // dy: 0
  swipeReq: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(_action, _screentype, _x, _y, _dx, _dy) {
      var swipeevent, res;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              swipeevent = void 0;

              if (!(_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret')) {
                _context3.next = 14;
                break;
              }

              _context3.t0 = _screentype.toLowerCase();
              _context3.next = _context3.t0 === 'top' ? 5 : _context3.t0 === 'upper' ? 7 : _context3.t0 === 'bottom' ? 9 : _context3.t0 === 'lower' ? 11 : 13;
              break;

            case 5:
              swipeevent = {
                action: _action,
                event: {
                  screentype: 1,
                  x: _x,
                  y: _y,
                  dx: _dx,
                  dy: _dy
                }
              };
              return _context3.abrupt('break', 14);

            case 7:
              swipeevent = {
                action: _action,
                event: {
                  screentype: 1,
                  x: _x,
                  y: _y,
                  dx: _dx,
                  dy: _dy
                }
              };
              return _context3.abrupt('break', 14);

            case 9:
              swipeevent = {
                action: _action,
                event: {
                  screentype: 2,
                  x: _x,
                  y: _y,
                  dx: _dx,
                  dy: _dy
                }
              };
              return _context3.abrupt('break', 14);

            case 11:
              swipeevent = {
                action: _action,
                event: {
                  screentype: 2,
                  x: _x,
                  y: _y,
                  dx: _dx,
                  dy: _dy
                }
              };
              return _context3.abrupt('break', 14);

            case 13:
              return _context3.abrupt('break', 14);

            case 14:
              if (swipeevent) {
                _context3.next = 16;
                break;
              }

              throw new Error('Unexpected parameters');

            case 16:
              _context3.next = 18;
              return axios$1.post('http://' + host + ':' + port$1 + '/remotepanel/swipe', swipeevent);

            case 18:
              res = _context3.sent;
              return _context3.abrupt('return', res.data);

            case 20:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function swipeReq(_x9, _x10, _x11, _x12, _x13, _x14) {
      return _ref3.apply(this, arguments);
    }

    return swipeReq;
  }(),

  //touchscreenshot {action:'exe'/'ret', event: {x:0, y:0}}
  // action:'exe'/'ret'(execute remotepanel / return canmsg)
  touchscreenshotReq: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(_action) {
      var ssevent, res;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              ssevent = void 0;

              if (_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret') {
                ssevent = {
                  action: _action,
                  event: {
                    x: 0,
                    y: 0
                  }
                };
              }

              if (ssevent) {
                _context4.next = 4;
                break;
              }

              throw new Error('Unexpected parameters');

            case 4:
              _context4.next = 6;
              return axios$1.post('http://' + host + ':' + port$1 + '/remotepanel/touchscreenshot', ssevent);

            case 6:
              res = _context4.sent;
              return _context4.abrupt('return', res.data);

            case 8:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function touchscreenshotReq(_x15) {
      return _ref4.apply(this, arguments);
    }

    return touchscreenshotReq;
  }()
};

var host$1 = 'locahost';
var port$2 = 6006;

var CANSim = {
  set host(val) {
    host$1 = val;
  },
  set port(val) {
    port$2 = val;
  },
  start: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var res;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return axios$1.post('http://' + host$1 + ':' + port$2 + '/cansim/start');

            case 2:
              res = _context.sent;
              return _context.abrupt('return', res.data.isStarted);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function start() {
      return _ref.apply(this, arguments);
    }

    return start;
  }(),
  stop: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
      var res;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return axios$1.post('http://' + host$1 + ':' + port$2 + '/cansim/stop');

            case 2:
              res = _context2.sent;
              return _context2.abrupt('return', res.data.isStarted);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function stop() {
      return _ref2.apply(this, arguments);
    }

    return stop;
  }(),
  reset: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
      var res;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return axios$1.post('http://' + host$1 + ':' + port$2 + '/cansim/reset');

            case 2:
              res = _context3.sent;
              return _context3.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function reset() {
      return _ref3.apply(this, arguments);
    }

    return reset;
  }(),
  setCycle: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(canID) {
      var res;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return axios$1.post('http://' + host$1 + ':' + port$2 + '/cansim/cycle/' + canID);

            case 2:
              res = _context4.sent;
              return _context4.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function setCycle(_x) {
      return _ref4.apply(this, arguments);
    }

    return setCycle;
  }(),
  delCycle: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(canID) {
      var res;
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return axios$1.delete('http://' + host$1 + ':' + port$2 + '/cansim/cycle/' + canID);

            case 2:
              res = _context5.sent;
              return _context5.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function delCycle(_x2) {
      return _ref5.apply(this, arguments);
    }

    return delCycle;
  }(),
  setCycleTime: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(canID, time) {
      var res;
      return regenerator.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return axios$1.post('http://' + host$1 + ':' + port$2 + '/cansim/cycle/' + canID + '/time', {
                time: time
              });

            case 2:
              res = _context6.sent;
              return _context6.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function setCycleTime(_x3, _x4) {
      return _ref6.apply(this, arguments);
    }

    return setCycleTime;
  }(),
  setData: function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(canID, data) {
      var res;
      return regenerator.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return axios$1.post('http://' + host$1 + ':' + port$2 + '/cansim/data/' + canID, {
                data: data
              });

            case 2:
              res = _context7.sent;
              return _context7.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function setData(_x5, _x6) {
      return _ref7.apply(this, arguments);
    }

    return setData;
  }(),
  setDataByName: function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8(canID, name, value) {
      var res;
      return regenerator.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return axios$1.post('http://' + host$1 + ':' + port$2 + '/cansim/data/' + canID + '/' + name, {
                value: value
              });

            case 2:
              res = _context8.sent;
              return _context8.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function setDataByName(_x7, _x8, _x9) {
      return _ref8.apply(this, arguments);
    }

    return setDataByName;
  }()
};

var host$2 = 'locahost';
var port$3 = 6006;

var BAPSim = {
  set host(val) {
    host$2 = val;
  },
  set port(val) {
    port$3 = val;
  },
  start: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var res;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/state', {
                isStarted: true
              });

            case 2:
              res = _context.sent;
              return _context.abrupt('return', res.data.isStarted === true);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function start() {
      return _ref.apply(this, arguments);
    }

    return start;
  }(),
  stop: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
      var res;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/state', {
                isStarted: false
              });

            case 2:
              res = _context2.sent;
              return _context2.abrupt('return', res.data.isStarted === false);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function stop() {
      return _ref2.apply(this, arguments);
    }

    return stop;
  }(),
  reset: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
      var res;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return axios$1.delete('http://' + host$2 + ':' + port$3 + '/bapsim/');

            case 2:
              res = _context3.sent;
              return _context3.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function reset() {
      return _ref3.apply(this, arguments);
    }

    return reset;
  }(),
  init: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(fileName) {
      var res;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/', {
                fileName: fileName
              });

            case 2:
              res = _context4.sent;
              return _context4.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function init(_x) {
      return _ref4.apply(this, arguments);
    }

    return init;
  }(),
  getState: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
      var res;
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return axios$1.get('http://' + host$2 + ':' + port$3 + '/bapsim/state');

            case 2:
              res = _context5.sent;
              return _context5.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function getState() {
      return _ref5.apply(this, arguments);
    }

    return getState;
  }(),
  getLSGList: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6() {
      var res;
      return regenerator.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return axios$1.get('http://' + host$2 + ':' + port$3 + '/bapsim/');

            case 2:
              res = _context6.sent;
              return _context6.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function getLSGList() {
      return _ref6.apply(this, arguments);
    }

    return getLSGList;
  }(),
  setData: function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(lsgID, fctID, data) {
      var res;
      return regenerator.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/lsg/' + lsgID + '/' + fctID, {
                data: data
              });

            case 2:
              res = _context7.sent;
              return _context7.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function setData(_x2, _x3, _x4) {
      return _ref7.apply(this, arguments);
    }

    return setData;
  }(),
  sendReq: function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8(lsgID, fctID, opCode, data) {
      var res;
      return regenerator.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/lsg/' + lsgID + '/' + fctID + '/' + opCode, {
                data: data
              });

            case 2:
              res = _context8.sent;
              return _context8.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function sendReq(_x5, _x6, _x7, _x8) {
      return _ref8.apply(this, arguments);
    }

    return sendReq;
  }(),
  switchLSG: function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee9(lsgID, state) {
      var res;
      return regenerator.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/lsg/' + lsgID, {
                state: state
              });

            case 2:
              res = _context9.sent;
              return _context9.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function switchLSG(_x9, _x10) {
      return _ref9.apply(this, arguments);
    }

    return switchLSG;
  }(),
  loadConfig: function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee10(fileName) {
      var res;
      return regenerator.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/data/all', {
                fileName: fileName
              });

            case 2:
              res = _context10.sent;
              return _context10.abrupt('return', res.data);

            case 4:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    function loadConfig(_x11) {
      return _ref10.apply(this, arguments);
    }

    return loadConfig;
  }(),
  startBAPCopy: function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee11() {
      var res;
      return regenerator.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/bapcopy', {
                isStarted: true
              });

            case 2:
              res = _context11.sent;
              return _context11.abrupt('return', res.data.isStarted === true);

            case 4:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }));

    function startBAPCopy() {
      return _ref11.apply(this, arguments);
    }

    return startBAPCopy;
  }(),
  stopBAPCopy: function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee12() {
      var res;
      return regenerator.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return axios$1.post('http://' + host$2 + ':' + port$3 + '/bapsim/bapcopy', {
                isStarted: false
              });

            case 2:
              res = _context12.sent;
              return _context12.abrupt('return', res.data.isStarted === false);

            case 4:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, this);
    }));

    function stopBAPCopy() {
      return _ref12.apply(this, arguments);
    }

    return stopBAPCopy;
  }()
};

var Simulation = function () {
  function Simulation(option) {
    _classCallCheck(this, Simulation);

    option = option || {};
    this.port = option.port || 6006;
    this.host = option.host || 'localhost';
    this.subscribeMap = {};
  }

  _createClass(Simulation, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        _this.socket = lib$4.connect('http://' + _this.host + ':' + _this.port + '/');
        _this.socket.on('connect', function () {
          resolve(1);
          Remotepanel.host = _this.host;
          Remotepanel.port = _this.port;
          CANSim.host = _this.host;
          CANSim.port = _this.port;
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
        });
        _this.socket.on('connect_error', function () {
          reject(1);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
          delete _this.socket;
        });
      });
    }
  }, {
    key: 'Remotepanel',
    get: function get() {
      if (!this.socket) throw new Error('Simualtion service not ready');
      return Remotepanel;
    }
  }, {
    key: 'CANSim',
    get: function get() {
      if (!this.socket) throw new Error('Simualtion service not ready');
      return CANSim;
    }
  }, {
    key: 'BAPSim',
    get: function get() {
      if (!this.socket) throw new Error('Simualtion service not ready');
      return BAPSim;
    }
  }]);

  return Simulation;
}();

var f$2 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$3
};

// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign = _core.Object.assign;

var assign$2 = createCommonjsModule(function (module) {
module.exports = { "default": assign, __esModule: true };
});

var _Object$assign = unwrapExports(assign$2);

var Stream = require$$0.Stream;


var delayed_stream = DelayedStream;
function DelayedStream() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;

  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source, options) {
  var delayedStream = new this();

  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  if (delayedStream.pauseStream) {
    source.pause();
  }

  return delayedStream;
};

Object.defineProperty(DelayedStream.prototype, 'readable', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});

DelayedStream.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype.pipe = function() {
  var r = Stream.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};

DelayedStream.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }

  if (args[0] === 'data') {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }

  this._bufferedEvents.push(args);
};

DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }

  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  this._maxDataSizeExceeded = true;
  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this.emit('error', new Error(message));
};

var defer_1 = defer$1;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer$1(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}

var Stream$1 = require$$0.Stream;



var combined_stream = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._released = false;
  this._streams = [];
  this._currentStream = null;
}
util.inherits(CombinedStream, Stream$1);

CombinedStream.create = function(options) {
  var combinedStream = new this();

  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }

  return combinedStream;
};

CombinedStream.isStreamLike = function(stream) {
  return (typeof stream !== 'function')
    && (typeof stream !== 'string')
    && (typeof stream !== 'boolean')
    && (typeof stream !== 'number')
    && (!Buffer.isBuffer(stream));
};

CombinedStream.prototype.append = function(stream) {
  var isStreamLike = CombinedStream.isStreamLike(stream);

  if (isStreamLike) {
    if (!(stream instanceof delayed_stream)) {
      var newStream = delayed_stream.create(stream, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams,
      });
      stream.on('data', this._checkDataSize.bind(this));
      stream = newStream;
    }

    this._handleErrors(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream$1.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

CombinedStream.prototype._getNext = function() {
  this._currentStream = null;
  var stream = this._streams.shift();


  if (typeof stream == 'undefined') {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('data', this._checkDataSize.bind(this));
      this._handleErrors(stream);
    }

    defer_1(this._pipeNext.bind(this, stream));
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  var isStreamLike = CombinedStream.isStreamLike(stream);
  if (isStreamLike) {
    stream.on('end', this._getNext.bind(this));
    stream.pipe(this, {end: false});
    return;
  }

  var value = stream;
  this.write(value);
  this._getNext();
};

CombinedStream.prototype._handleErrors = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._emitError(err);
  });
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};

CombinedStream.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this._emitError(new Error(message));
};

CombinedStream.prototype._updateDataSize = function() {
  this.dataSize = 0;

  var self = this;
  this._streams.forEach(function(stream) {
    if (!stream.dataSize) {
      return;
    }

    self.dataSize += stream.dataSize;
  });

  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};

CombinedStream.prototype._emitError = function(err) {
  this._reset();
  this.emit('error', err);
};

var db = {
	"application/1d-interleaved-parityfec": {"source":"iana"},
	"application/3gpdash-qoe-report+xml": {"source":"iana"},
	"application/3gpp-ims+xml": {"source":"iana"},
	"application/a2l": {"source":"iana"},
	"application/activemessage": {"source":"iana"},
	"application/alto-costmap+json": {"source":"iana","compressible":true},
	"application/alto-costmapfilter+json": {"source":"iana","compressible":true},
	"application/alto-directory+json": {"source":"iana","compressible":true},
	"application/alto-endpointcost+json": {"source":"iana","compressible":true},
	"application/alto-endpointcostparams+json": {"source":"iana","compressible":true},
	"application/alto-endpointprop+json": {"source":"iana","compressible":true},
	"application/alto-endpointpropparams+json": {"source":"iana","compressible":true},
	"application/alto-error+json": {"source":"iana","compressible":true},
	"application/alto-networkmap+json": {"source":"iana","compressible":true},
	"application/alto-networkmapfilter+json": {"source":"iana","compressible":true},
	"application/aml": {"source":"iana"},
	"application/andrew-inset": {"source":"iana","extensions":["ez"]},
	"application/applefile": {"source":"iana"},
	"application/applixware": {"source":"apache","extensions":["aw"]},
	"application/atf": {"source":"iana"},
	"application/atfx": {"source":"iana"},
	"application/atom+xml": {"source":"iana","compressible":true,"extensions":["atom"]},
	"application/atomcat+xml": {"source":"iana","extensions":["atomcat"]},
	"application/atomdeleted+xml": {"source":"iana"},
	"application/atomicmail": {"source":"iana"},
	"application/atomsvc+xml": {"source":"iana","extensions":["atomsvc"]},
	"application/atxml": {"source":"iana"},
	"application/auth-policy+xml": {"source":"iana"},
	"application/bacnet-xdd+zip": {"source":"iana"},
	"application/batch-smtp": {"source":"iana"},
	"application/bdoc": {"compressible":false,"extensions":["bdoc"]},
	"application/beep+xml": {"source":"iana"},
	"application/calendar+json": {"source":"iana","compressible":true},
	"application/calendar+xml": {"source":"iana"},
	"application/call-completion": {"source":"iana"},
	"application/cals-1840": {"source":"iana"},
	"application/cbor": {"source":"iana"},
	"application/cccex": {"source":"iana"},
	"application/ccmp+xml": {"source":"iana"},
	"application/ccxml+xml": {"source":"iana","extensions":["ccxml"]},
	"application/cdfx+xml": {"source":"iana"},
	"application/cdmi-capability": {"source":"iana","extensions":["cdmia"]},
	"application/cdmi-container": {"source":"iana","extensions":["cdmic"]},
	"application/cdmi-domain": {"source":"iana","extensions":["cdmid"]},
	"application/cdmi-object": {"source":"iana","extensions":["cdmio"]},
	"application/cdmi-queue": {"source":"iana","extensions":["cdmiq"]},
	"application/cdni": {"source":"iana"},
	"application/cea": {"source":"iana"},
	"application/cea-2018+xml": {"source":"iana"},
	"application/cellml+xml": {"source":"iana"},
	"application/cfw": {"source":"iana"},
	"application/clue_info+xml": {"source":"iana"},
	"application/cms": {"source":"iana"},
	"application/cnrp+xml": {"source":"iana"},
	"application/coap-group+json": {"source":"iana","compressible":true},
	"application/coap-payload": {"source":"iana"},
	"application/commonground": {"source":"iana"},
	"application/conference-info+xml": {"source":"iana"},
	"application/cose": {"source":"iana"},
	"application/cose-key": {"source":"iana"},
	"application/cose-key-set": {"source":"iana"},
	"application/cpl+xml": {"source":"iana"},
	"application/csrattrs": {"source":"iana"},
	"application/csta+xml": {"source":"iana"},
	"application/cstadata+xml": {"source":"iana"},
	"application/csvm+json": {"source":"iana","compressible":true},
	"application/cu-seeme": {"source":"apache","extensions":["cu"]},
	"application/cybercash": {"source":"iana"},
	"application/dart": {"compressible":true},
	"application/dash+xml": {"source":"iana","extensions":["mpd"]},
	"application/dashdelta": {"source":"iana"},
	"application/davmount+xml": {"source":"iana","extensions":["davmount"]},
	"application/dca-rft": {"source":"iana"},
	"application/dcd": {"source":"iana"},
	"application/dec-dx": {"source":"iana"},
	"application/dialog-info+xml": {"source":"iana"},
	"application/dicom": {"source":"iana"},
	"application/dicom+json": {"source":"iana","compressible":true},
	"application/dicom+xml": {"source":"iana"},
	"application/dii": {"source":"iana"},
	"application/dit": {"source":"iana"},
	"application/dns": {"source":"iana"},
	"application/docbook+xml": {"source":"apache","extensions":["dbk"]},
	"application/dskpp+xml": {"source":"iana"},
	"application/dssc+der": {"source":"iana","extensions":["dssc"]},
	"application/dssc+xml": {"source":"iana","extensions":["xdssc"]},
	"application/dvcs": {"source":"iana"},
	"application/ecmascript": {"source":"iana","compressible":true,"extensions":["ecma"]},
	"application/edi-consent": {"source":"iana"},
	"application/edi-x12": {"source":"iana","compressible":false},
	"application/edifact": {"source":"iana","compressible":false},
	"application/efi": {"source":"iana"},
	"application/emergencycalldata.comment+xml": {"source":"iana"},
	"application/emergencycalldata.control+xml": {"source":"iana"},
	"application/emergencycalldata.deviceinfo+xml": {"source":"iana"},
	"application/emergencycalldata.ecall.msd": {"source":"iana"},
	"application/emergencycalldata.providerinfo+xml": {"source":"iana"},
	"application/emergencycalldata.serviceinfo+xml": {"source":"iana"},
	"application/emergencycalldata.subscriberinfo+xml": {"source":"iana"},
	"application/emergencycalldata.veds+xml": {"source":"iana"},
	"application/emma+xml": {"source":"iana","extensions":["emma"]},
	"application/emotionml+xml": {"source":"iana"},
	"application/encaprtp": {"source":"iana"},
	"application/epp+xml": {"source":"iana"},
	"application/epub+zip": {"source":"iana","extensions":["epub"]},
	"application/eshop": {"source":"iana"},
	"application/exi": {"source":"iana","extensions":["exi"]},
	"application/fastinfoset": {"source":"iana"},
	"application/fastsoap": {"source":"iana"},
	"application/fdt+xml": {"source":"iana"},
	"application/fhir+xml": {"source":"iana"},
	"application/fido.trusted-apps+json": {"compressible":true},
	"application/fits": {"source":"iana"},
	"application/font-sfnt": {"source":"iana"},
	"application/font-tdpfr": {"source":"iana","extensions":["pfr"]},
	"application/font-woff": {"source":"iana","compressible":false,"extensions":["woff"]},
	"application/framework-attributes+xml": {"source":"iana"},
	"application/geo+json": {"source":"iana","compressible":true,"extensions":["geojson"]},
	"application/geo+json-seq": {"source":"iana"},
	"application/geoxacml+xml": {"source":"iana"},
	"application/gml+xml": {"source":"iana","extensions":["gml"]},
	"application/gpx+xml": {"source":"apache","extensions":["gpx"]},
	"application/gxf": {"source":"apache","extensions":["gxf"]},
	"application/gzip": {"source":"iana","compressible":false,"extensions":["gz"]},
	"application/h224": {"source":"iana"},
	"application/held+xml": {"source":"iana"},
	"application/hjson": {"extensions":["hjson"]},
	"application/http": {"source":"iana"},
	"application/hyperstudio": {"source":"iana","extensions":["stk"]},
	"application/ibe-key-request+xml": {"source":"iana"},
	"application/ibe-pkg-reply+xml": {"source":"iana"},
	"application/ibe-pp-data": {"source":"iana"},
	"application/iges": {"source":"iana"},
	"application/im-iscomposing+xml": {"source":"iana"},
	"application/index": {"source":"iana"},
	"application/index.cmd": {"source":"iana"},
	"application/index.obj": {"source":"iana"},
	"application/index.response": {"source":"iana"},
	"application/index.vnd": {"source":"iana"},
	"application/inkml+xml": {"source":"iana","extensions":["ink","inkml"]},
	"application/iotp": {"source":"iana"},
	"application/ipfix": {"source":"iana","extensions":["ipfix"]},
	"application/ipp": {"source":"iana"},
	"application/isup": {"source":"iana"},
	"application/its+xml": {"source":"iana"},
	"application/java-archive": {"source":"apache","compressible":false,"extensions":["jar","war","ear"]},
	"application/java-serialized-object": {"source":"apache","compressible":false,"extensions":["ser"]},
	"application/java-vm": {"source":"apache","compressible":false,"extensions":["class"]},
	"application/javascript": {"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},
	"application/jf2feed+json": {"source":"iana","compressible":true},
	"application/jose": {"source":"iana"},
	"application/jose+json": {"source":"iana","compressible":true},
	"application/jrd+json": {"source":"iana","compressible":true},
	"application/json": {"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},
	"application/json-patch+json": {"source":"iana","compressible":true},
	"application/json-seq": {"source":"iana"},
	"application/json5": {"extensions":["json5"]},
	"application/jsonml+json": {"source":"apache","compressible":true,"extensions":["jsonml"]},
	"application/jwk+json": {"source":"iana","compressible":true},
	"application/jwk-set+json": {"source":"iana","compressible":true},
	"application/jwt": {"source":"iana"},
	"application/kpml-request+xml": {"source":"iana"},
	"application/kpml-response+xml": {"source":"iana"},
	"application/ld+json": {"source":"iana","compressible":true,"extensions":["jsonld"]},
	"application/lgr+xml": {"source":"iana"},
	"application/link-format": {"source":"iana"},
	"application/load-control+xml": {"source":"iana"},
	"application/lost+xml": {"source":"iana","extensions":["lostxml"]},
	"application/lostsync+xml": {"source":"iana"},
	"application/lxf": {"source":"iana"},
	"application/mac-binhex40": {"source":"iana","extensions":["hqx"]},
	"application/mac-compactpro": {"source":"apache","extensions":["cpt"]},
	"application/macwriteii": {"source":"iana"},
	"application/mads+xml": {"source":"iana","extensions":["mads"]},
	"application/manifest+json": {"charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},
	"application/marc": {"source":"iana","extensions":["mrc"]},
	"application/marcxml+xml": {"source":"iana","extensions":["mrcx"]},
	"application/mathematica": {"source":"iana","extensions":["ma","nb","mb"]},
	"application/mathml+xml": {"source":"iana","extensions":["mathml"]},
	"application/mathml-content+xml": {"source":"iana"},
	"application/mathml-presentation+xml": {"source":"iana"},
	"application/mbms-associated-procedure-description+xml": {"source":"iana"},
	"application/mbms-deregister+xml": {"source":"iana"},
	"application/mbms-envelope+xml": {"source":"iana"},
	"application/mbms-msk+xml": {"source":"iana"},
	"application/mbms-msk-response+xml": {"source":"iana"},
	"application/mbms-protection-description+xml": {"source":"iana"},
	"application/mbms-reception-report+xml": {"source":"iana"},
	"application/mbms-register+xml": {"source":"iana"},
	"application/mbms-register-response+xml": {"source":"iana"},
	"application/mbms-schedule+xml": {"source":"iana"},
	"application/mbms-user-service-description+xml": {"source":"iana"},
	"application/mbox": {"source":"iana","extensions":["mbox"]},
	"application/media-policy-dataset+xml": {"source":"iana"},
	"application/media_control+xml": {"source":"iana"},
	"application/mediaservercontrol+xml": {"source":"iana","extensions":["mscml"]},
	"application/merge-patch+json": {"source":"iana","compressible":true},
	"application/metalink+xml": {"source":"apache","extensions":["metalink"]},
	"application/metalink4+xml": {"source":"iana","extensions":["meta4"]},
	"application/mets+xml": {"source":"iana","extensions":["mets"]},
	"application/mf4": {"source":"iana"},
	"application/mikey": {"source":"iana"},
	"application/mmt-usd+xml": {"source":"iana"},
	"application/mods+xml": {"source":"iana","extensions":["mods"]},
	"application/moss-keys": {"source":"iana"},
	"application/moss-signature": {"source":"iana"},
	"application/mosskey-data": {"source":"iana"},
	"application/mosskey-request": {"source":"iana"},
	"application/mp21": {"source":"iana","extensions":["m21","mp21"]},
	"application/mp4": {"source":"iana","extensions":["mp4s","m4p"]},
	"application/mpeg4-generic": {"source":"iana"},
	"application/mpeg4-iod": {"source":"iana"},
	"application/mpeg4-iod-xmt": {"source":"iana"},
	"application/mrb-consumer+xml": {"source":"iana"},
	"application/mrb-publish+xml": {"source":"iana"},
	"application/msc-ivr+xml": {"source":"iana"},
	"application/msc-mixer+xml": {"source":"iana"},
	"application/msword": {"source":"iana","compressible":false,"extensions":["doc","dot"]},
	"application/mud+json": {"source":"iana","compressible":true},
	"application/mxf": {"source":"iana","extensions":["mxf"]},
	"application/n-quads": {"source":"iana"},
	"application/n-triples": {"source":"iana"},
	"application/nasdata": {"source":"iana"},
	"application/news-checkgroups": {"source":"iana"},
	"application/news-groupinfo": {"source":"iana"},
	"application/news-transmission": {"source":"iana"},
	"application/nlsml+xml": {"source":"iana"},
	"application/node": {"source":"iana"},
	"application/nss": {"source":"iana"},
	"application/ocsp-request": {"source":"iana"},
	"application/ocsp-response": {"source":"iana"},
	"application/octet-stream": {"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},
	"application/oda": {"source":"iana","extensions":["oda"]},
	"application/odx": {"source":"iana"},
	"application/oebps-package+xml": {"source":"iana","extensions":["opf"]},
	"application/ogg": {"source":"iana","compressible":false,"extensions":["ogx"]},
	"application/omdoc+xml": {"source":"apache","extensions":["omdoc"]},
	"application/onenote": {"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},
	"application/oxps": {"source":"iana","extensions":["oxps"]},
	"application/p2p-overlay+xml": {"source":"iana"},
	"application/parityfec": {"source":"iana"},
	"application/passport": {"source":"iana"},
	"application/patch-ops-error+xml": {"source":"iana","extensions":["xer"]},
	"application/pdf": {"source":"iana","compressible":false,"extensions":["pdf"]},
	"application/pdx": {"source":"iana"},
	"application/pgp-encrypted": {"source":"iana","compressible":false,"extensions":["pgp"]},
	"application/pgp-keys": {"source":"iana"},
	"application/pgp-signature": {"source":"iana","extensions":["asc","sig"]},
	"application/pics-rules": {"source":"apache","extensions":["prf"]},
	"application/pidf+xml": {"source":"iana"},
	"application/pidf-diff+xml": {"source":"iana"},
	"application/pkcs10": {"source":"iana","extensions":["p10"]},
	"application/pkcs12": {"source":"iana"},
	"application/pkcs7-mime": {"source":"iana","extensions":["p7m","p7c"]},
	"application/pkcs7-signature": {"source":"iana","extensions":["p7s"]},
	"application/pkcs8": {"source":"iana","extensions":["p8"]},
	"application/pkcs8-encrypted": {"source":"iana"},
	"application/pkix-attr-cert": {"source":"iana","extensions":["ac"]},
	"application/pkix-cert": {"source":"iana","extensions":["cer"]},
	"application/pkix-crl": {"source":"iana","extensions":["crl"]},
	"application/pkix-pkipath": {"source":"iana","extensions":["pkipath"]},
	"application/pkixcmp": {"source":"iana","extensions":["pki"]},
	"application/pls+xml": {"source":"iana","extensions":["pls"]},
	"application/poc-settings+xml": {"source":"iana"},
	"application/postscript": {"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},
	"application/ppsp-tracker+json": {"source":"iana","compressible":true},
	"application/problem+json": {"source":"iana","compressible":true},
	"application/problem+xml": {"source":"iana"},
	"application/provenance+xml": {"source":"iana"},
	"application/prs.alvestrand.titrax-sheet": {"source":"iana"},
	"application/prs.cww": {"source":"iana","extensions":["cww"]},
	"application/prs.hpub+zip": {"source":"iana"},
	"application/prs.nprend": {"source":"iana"},
	"application/prs.plucker": {"source":"iana"},
	"application/prs.rdf-xml-crypt": {"source":"iana"},
	"application/prs.xsf+xml": {"source":"iana"},
	"application/pskc+xml": {"source":"iana","extensions":["pskcxml"]},
	"application/qsig": {"source":"iana"},
	"application/raml+yaml": {"compressible":true,"extensions":["raml"]},
	"application/raptorfec": {"source":"iana"},
	"application/rdap+json": {"source":"iana","compressible":true},
	"application/rdf+xml": {"source":"iana","compressible":true,"extensions":["rdf"]},
	"application/reginfo+xml": {"source":"iana","extensions":["rif"]},
	"application/relax-ng-compact-syntax": {"source":"iana","extensions":["rnc"]},
	"application/remote-printing": {"source":"iana"},
	"application/reputon+json": {"source":"iana","compressible":true},
	"application/resource-lists+xml": {"source":"iana","extensions":["rl"]},
	"application/resource-lists-diff+xml": {"source":"iana","extensions":["rld"]},
	"application/rfc+xml": {"source":"iana"},
	"application/riscos": {"source":"iana"},
	"application/rlmi+xml": {"source":"iana"},
	"application/rls-services+xml": {"source":"iana","extensions":["rs"]},
	"application/route-apd+xml": {"source":"iana"},
	"application/route-s-tsid+xml": {"source":"iana"},
	"application/route-usd+xml": {"source":"iana"},
	"application/rpki-ghostbusters": {"source":"iana","extensions":["gbr"]},
	"application/rpki-manifest": {"source":"iana","extensions":["mft"]},
	"application/rpki-publication": {"source":"iana"},
	"application/rpki-roa": {"source":"iana","extensions":["roa"]},
	"application/rpki-updown": {"source":"iana"},
	"application/rsd+xml": {"source":"apache","extensions":["rsd"]},
	"application/rss+xml": {"source":"apache","compressible":true,"extensions":["rss"]},
	"application/rtf": {"source":"iana","compressible":true,"extensions":["rtf"]},
	"application/rtploopback": {"source":"iana"},
	"application/rtx": {"source":"iana"},
	"application/samlassertion+xml": {"source":"iana"},
	"application/samlmetadata+xml": {"source":"iana"},
	"application/sbml+xml": {"source":"iana","extensions":["sbml"]},
	"application/scaip+xml": {"source":"iana"},
	"application/scim+json": {"source":"iana","compressible":true},
	"application/scvp-cv-request": {"source":"iana","extensions":["scq"]},
	"application/scvp-cv-response": {"source":"iana","extensions":["scs"]},
	"application/scvp-vp-request": {"source":"iana","extensions":["spq"]},
	"application/scvp-vp-response": {"source":"iana","extensions":["spp"]},
	"application/sdp": {"source":"iana","extensions":["sdp"]},
	"application/sep+xml": {"source":"iana"},
	"application/sep-exi": {"source":"iana"},
	"application/session-info": {"source":"iana"},
	"application/set-payment": {"source":"iana"},
	"application/set-payment-initiation": {"source":"iana","extensions":["setpay"]},
	"application/set-registration": {"source":"iana"},
	"application/set-registration-initiation": {"source":"iana","extensions":["setreg"]},
	"application/sgml": {"source":"iana"},
	"application/sgml-open-catalog": {"source":"iana"},
	"application/shf+xml": {"source":"iana","extensions":["shf"]},
	"application/sieve": {"source":"iana"},
	"application/simple-filter+xml": {"source":"iana"},
	"application/simple-message-summary": {"source":"iana"},
	"application/simplesymbolcontainer": {"source":"iana"},
	"application/slate": {"source":"iana"},
	"application/smil": {"source":"iana"},
	"application/smil+xml": {"source":"iana","extensions":["smi","smil"]},
	"application/smpte336m": {"source":"iana"},
	"application/soap+fastinfoset": {"source":"iana"},
	"application/soap+xml": {"source":"iana","compressible":true},
	"application/sparql-query": {"source":"iana","extensions":["rq"]},
	"application/sparql-results+xml": {"source":"iana","extensions":["srx"]},
	"application/spirits-event+xml": {"source":"iana"},
	"application/sql": {"source":"iana"},
	"application/srgs": {"source":"iana","extensions":["gram"]},
	"application/srgs+xml": {"source":"iana","extensions":["grxml"]},
	"application/sru+xml": {"source":"iana","extensions":["sru"]},
	"application/ssdl+xml": {"source":"apache","extensions":["ssdl"]},
	"application/ssml+xml": {"source":"iana","extensions":["ssml"]},
	"application/tamp-apex-update": {"source":"iana"},
	"application/tamp-apex-update-confirm": {"source":"iana"},
	"application/tamp-community-update": {"source":"iana"},
	"application/tamp-community-update-confirm": {"source":"iana"},
	"application/tamp-error": {"source":"iana"},
	"application/tamp-sequence-adjust": {"source":"iana"},
	"application/tamp-sequence-adjust-confirm": {"source":"iana"},
	"application/tamp-status-query": {"source":"iana"},
	"application/tamp-status-response": {"source":"iana"},
	"application/tamp-update": {"source":"iana"},
	"application/tamp-update-confirm": {"source":"iana"},
	"application/tar": {"compressible":true},
	"application/tei+xml": {"source":"iana","extensions":["tei","teicorpus"]},
	"application/thraud+xml": {"source":"iana","extensions":["tfi"]},
	"application/timestamp-query": {"source":"iana"},
	"application/timestamp-reply": {"source":"iana"},
	"application/timestamped-data": {"source":"iana","extensions":["tsd"]},
	"application/tnauthlist": {"source":"iana"},
	"application/trig": {"source":"iana"},
	"application/ttml+xml": {"source":"iana"},
	"application/tve-trigger": {"source":"iana"},
	"application/ulpfec": {"source":"iana"},
	"application/urc-grpsheet+xml": {"source":"iana"},
	"application/urc-ressheet+xml": {"source":"iana"},
	"application/urc-targetdesc+xml": {"source":"iana"},
	"application/urc-uisocketdesc+xml": {"source":"iana"},
	"application/vcard+json": {"source":"iana","compressible":true},
	"application/vcard+xml": {"source":"iana"},
	"application/vemmi": {"source":"iana"},
	"application/vividence.scriptfile": {"source":"apache"},
	"application/vnd.1000minds.decision-model+xml": {"source":"iana"},
	"application/vnd.3gpp-prose+xml": {"source":"iana"},
	"application/vnd.3gpp-prose-pc3ch+xml": {"source":"iana"},
	"application/vnd.3gpp-v2x-local-service-information": {"source":"iana"},
	"application/vnd.3gpp.access-transfer-events+xml": {"source":"iana"},
	"application/vnd.3gpp.bsf+xml": {"source":"iana"},
	"application/vnd.3gpp.gmop+xml": {"source":"iana"},
	"application/vnd.3gpp.mcptt-affiliation-command+xml": {"source":"iana"},
	"application/vnd.3gpp.mcptt-floor-request+xml": {"source":"iana"},
	"application/vnd.3gpp.mcptt-info+xml": {"source":"iana"},
	"application/vnd.3gpp.mcptt-location-info+xml": {"source":"iana"},
	"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {"source":"iana"},
	"application/vnd.3gpp.mcptt-signed+xml": {"source":"iana"},
	"application/vnd.3gpp.mid-call+xml": {"source":"iana"},
	"application/vnd.3gpp.pic-bw-large": {"source":"iana","extensions":["plb"]},
	"application/vnd.3gpp.pic-bw-small": {"source":"iana","extensions":["psb"]},
	"application/vnd.3gpp.pic-bw-var": {"source":"iana","extensions":["pvb"]},
	"application/vnd.3gpp.sms": {"source":"iana"},
	"application/vnd.3gpp.sms+xml": {"source":"iana"},
	"application/vnd.3gpp.srvcc-ext+xml": {"source":"iana"},
	"application/vnd.3gpp.srvcc-info+xml": {"source":"iana"},
	"application/vnd.3gpp.state-and-event-info+xml": {"source":"iana"},
	"application/vnd.3gpp.ussd+xml": {"source":"iana"},
	"application/vnd.3gpp2.bcmcsinfo+xml": {"source":"iana"},
	"application/vnd.3gpp2.sms": {"source":"iana"},
	"application/vnd.3gpp2.tcap": {"source":"iana","extensions":["tcap"]},
	"application/vnd.3lightssoftware.imagescal": {"source":"iana"},
	"application/vnd.3m.post-it-notes": {"source":"iana","extensions":["pwn"]},
	"application/vnd.accpac.simply.aso": {"source":"iana","extensions":["aso"]},
	"application/vnd.accpac.simply.imp": {"source":"iana","extensions":["imp"]},
	"application/vnd.acucobol": {"source":"iana","extensions":["acu"]},
	"application/vnd.acucorp": {"source":"iana","extensions":["atc","acutc"]},
	"application/vnd.adobe.air-application-installer-package+zip": {"source":"apache","extensions":["air"]},
	"application/vnd.adobe.flash.movie": {"source":"iana"},
	"application/vnd.adobe.formscentral.fcdt": {"source":"iana","extensions":["fcdt"]},
	"application/vnd.adobe.fxp": {"source":"iana","extensions":["fxp","fxpl"]},
	"application/vnd.adobe.partial-upload": {"source":"iana"},
	"application/vnd.adobe.xdp+xml": {"source":"iana","extensions":["xdp"]},
	"application/vnd.adobe.xfdf": {"source":"iana","extensions":["xfdf"]},
	"application/vnd.aether.imp": {"source":"iana"},
	"application/vnd.ah-barcode": {"source":"iana"},
	"application/vnd.ahead.space": {"source":"iana","extensions":["ahead"]},
	"application/vnd.airzip.filesecure.azf": {"source":"iana","extensions":["azf"]},
	"application/vnd.airzip.filesecure.azs": {"source":"iana","extensions":["azs"]},
	"application/vnd.amadeus+json": {"source":"iana","compressible":true},
	"application/vnd.amazon.ebook": {"source":"apache","extensions":["azw"]},
	"application/vnd.amazon.mobi8-ebook": {"source":"iana"},
	"application/vnd.americandynamics.acc": {"source":"iana","extensions":["acc"]},
	"application/vnd.amiga.ami": {"source":"iana","extensions":["ami"]},
	"application/vnd.amundsen.maze+xml": {"source":"iana"},
	"application/vnd.android.package-archive": {"source":"apache","compressible":false,"extensions":["apk"]},
	"application/vnd.anki": {"source":"iana"},
	"application/vnd.anser-web-certificate-issue-initiation": {"source":"iana","extensions":["cii"]},
	"application/vnd.anser-web-funds-transfer-initiation": {"source":"apache","extensions":["fti"]},
	"application/vnd.antix.game-component": {"source":"iana","extensions":["atx"]},
	"application/vnd.apache.thrift.binary": {"source":"iana"},
	"application/vnd.apache.thrift.compact": {"source":"iana"},
	"application/vnd.apache.thrift.json": {"source":"iana"},
	"application/vnd.api+json": {"source":"iana","compressible":true},
	"application/vnd.apothekende.reservation+json": {"source":"iana","compressible":true},
	"application/vnd.apple.installer+xml": {"source":"iana","extensions":["mpkg"]},
	"application/vnd.apple.mpegurl": {"source":"iana","extensions":["m3u8"]},
	"application/vnd.apple.pkpass": {"compressible":false,"extensions":["pkpass"]},
	"application/vnd.arastra.swi": {"source":"iana"},
	"application/vnd.aristanetworks.swi": {"source":"iana","extensions":["swi"]},
	"application/vnd.artsquare": {"source":"iana"},
	"application/vnd.astraea-software.iota": {"source":"iana","extensions":["iota"]},
	"application/vnd.audiograph": {"source":"iana","extensions":["aep"]},
	"application/vnd.autopackage": {"source":"iana"},
	"application/vnd.avalon+json": {"source":"iana","compressible":true},
	"application/vnd.avistar+xml": {"source":"iana"},
	"application/vnd.balsamiq.bmml+xml": {"source":"iana"},
	"application/vnd.balsamiq.bmpr": {"source":"iana"},
	"application/vnd.bbf.usp.msg": {"source":"iana"},
	"application/vnd.bbf.usp.msg+json": {"source":"iana","compressible":true},
	"application/vnd.bekitzur-stech+json": {"source":"iana","compressible":true},
	"application/vnd.bint.med-content": {"source":"iana"},
	"application/vnd.biopax.rdf+xml": {"source":"iana"},
	"application/vnd.blink-idb-value-wrapper": {"source":"iana"},
	"application/vnd.blueice.multipass": {"source":"iana","extensions":["mpm"]},
	"application/vnd.bluetooth.ep.oob": {"source":"iana"},
	"application/vnd.bluetooth.le.oob": {"source":"iana"},
	"application/vnd.bmi": {"source":"iana","extensions":["bmi"]},
	"application/vnd.businessobjects": {"source":"iana","extensions":["rep"]},
	"application/vnd.cab-jscript": {"source":"iana"},
	"application/vnd.canon-cpdl": {"source":"iana"},
	"application/vnd.canon-lips": {"source":"iana"},
	"application/vnd.capasystems-pg+json": {"source":"iana","compressible":true},
	"application/vnd.cendio.thinlinc.clientconf": {"source":"iana"},
	"application/vnd.century-systems.tcp_stream": {"source":"iana"},
	"application/vnd.chemdraw+xml": {"source":"iana","extensions":["cdxml"]},
	"application/vnd.chess-pgn": {"source":"iana"},
	"application/vnd.chipnuts.karaoke-mmd": {"source":"iana","extensions":["mmd"]},
	"application/vnd.cinderella": {"source":"iana","extensions":["cdy"]},
	"application/vnd.cirpack.isdn-ext": {"source":"iana"},
	"application/vnd.citationstyles.style+xml": {"source":"iana"},
	"application/vnd.claymore": {"source":"iana","extensions":["cla"]},
	"application/vnd.cloanto.rp9": {"source":"iana","extensions":["rp9"]},
	"application/vnd.clonk.c4group": {"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},
	"application/vnd.cluetrust.cartomobile-config": {"source":"iana","extensions":["c11amc"]},
	"application/vnd.cluetrust.cartomobile-config-pkg": {"source":"iana","extensions":["c11amz"]},
	"application/vnd.coffeescript": {"source":"iana"},
	"application/vnd.collabio.xodocuments.document": {"source":"iana"},
	"application/vnd.collabio.xodocuments.document-template": {"source":"iana"},
	"application/vnd.collabio.xodocuments.presentation": {"source":"iana"},
	"application/vnd.collabio.xodocuments.presentation-template": {"source":"iana"},
	"application/vnd.collabio.xodocuments.spreadsheet": {"source":"iana"},
	"application/vnd.collabio.xodocuments.spreadsheet-template": {"source":"iana"},
	"application/vnd.collection+json": {"source":"iana","compressible":true},
	"application/vnd.collection.doc+json": {"source":"iana","compressible":true},
	"application/vnd.collection.next+json": {"source":"iana","compressible":true},
	"application/vnd.comicbook+zip": {"source":"iana"},
	"application/vnd.comicbook-rar": {"source":"iana"},
	"application/vnd.commerce-battelle": {"source":"iana"},
	"application/vnd.commonspace": {"source":"iana","extensions":["csp"]},
	"application/vnd.contact.cmsg": {"source":"iana","extensions":["cdbcmsg"]},
	"application/vnd.coreos.ignition+json": {"source":"iana","compressible":true},
	"application/vnd.cosmocaller": {"source":"iana","extensions":["cmc"]},
	"application/vnd.crick.clicker": {"source":"iana","extensions":["clkx"]},
	"application/vnd.crick.clicker.keyboard": {"source":"iana","extensions":["clkk"]},
	"application/vnd.crick.clicker.palette": {"source":"iana","extensions":["clkp"]},
	"application/vnd.crick.clicker.template": {"source":"iana","extensions":["clkt"]},
	"application/vnd.crick.clicker.wordbank": {"source":"iana","extensions":["clkw"]},
	"application/vnd.criticaltools.wbs+xml": {"source":"iana","extensions":["wbs"]},
	"application/vnd.ctc-posml": {"source":"iana","extensions":["pml"]},
	"application/vnd.ctct.ws+xml": {"source":"iana"},
	"application/vnd.cups-pdf": {"source":"iana"},
	"application/vnd.cups-postscript": {"source":"iana"},
	"application/vnd.cups-ppd": {"source":"iana","extensions":["ppd"]},
	"application/vnd.cups-raster": {"source":"iana"},
	"application/vnd.cups-raw": {"source":"iana"},
	"application/vnd.curl": {"source":"iana"},
	"application/vnd.curl.car": {"source":"apache","extensions":["car"]},
	"application/vnd.curl.pcurl": {"source":"apache","extensions":["pcurl"]},
	"application/vnd.cyan.dean.root+xml": {"source":"iana"},
	"application/vnd.cybank": {"source":"iana"},
	"application/vnd.d2l.coursepackage1p0+zip": {"source":"iana"},
	"application/vnd.dart": {"source":"iana","compressible":true,"extensions":["dart"]},
	"application/vnd.data-vision.rdz": {"source":"iana","extensions":["rdz"]},
	"application/vnd.datapackage+json": {"source":"iana","compressible":true},
	"application/vnd.dataresource+json": {"source":"iana","compressible":true},
	"application/vnd.debian.binary-package": {"source":"iana"},
	"application/vnd.dece.data": {"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},
	"application/vnd.dece.ttml+xml": {"source":"iana","extensions":["uvt","uvvt"]},
	"application/vnd.dece.unspecified": {"source":"iana","extensions":["uvx","uvvx"]},
	"application/vnd.dece.zip": {"source":"iana","extensions":["uvz","uvvz"]},
	"application/vnd.denovo.fcselayout-link": {"source":"iana","extensions":["fe_launch"]},
	"application/vnd.desmume-movie": {"source":"iana"},
	"application/vnd.desmume.movie": {"source":"apache"},
	"application/vnd.dir-bi.plate-dl-nosuffix": {"source":"iana"},
	"application/vnd.dm.delegation+xml": {"source":"iana"},
	"application/vnd.dna": {"source":"iana","extensions":["dna"]},
	"application/vnd.document+json": {"source":"iana","compressible":true},
	"application/vnd.dolby.mlp": {"source":"apache","extensions":["mlp"]},
	"application/vnd.dolby.mobile.1": {"source":"iana"},
	"application/vnd.dolby.mobile.2": {"source":"iana"},
	"application/vnd.doremir.scorecloud-binary-document": {"source":"iana"},
	"application/vnd.dpgraph": {"source":"iana","extensions":["dpg"]},
	"application/vnd.dreamfactory": {"source":"iana","extensions":["dfac"]},
	"application/vnd.drive+json": {"source":"iana","compressible":true},
	"application/vnd.ds-keypoint": {"source":"apache","extensions":["kpxx"]},
	"application/vnd.dtg.local": {"source":"iana"},
	"application/vnd.dtg.local.flash": {"source":"iana"},
	"application/vnd.dtg.local.html": {"source":"iana"},
	"application/vnd.dvb.ait": {"source":"iana","extensions":["ait"]},
	"application/vnd.dvb.dvbj": {"source":"iana"},
	"application/vnd.dvb.esgcontainer": {"source":"iana"},
	"application/vnd.dvb.ipdcdftnotifaccess": {"source":"iana"},
	"application/vnd.dvb.ipdcesgaccess": {"source":"iana"},
	"application/vnd.dvb.ipdcesgaccess2": {"source":"iana"},
	"application/vnd.dvb.ipdcesgpdd": {"source":"iana"},
	"application/vnd.dvb.ipdcroaming": {"source":"iana"},
	"application/vnd.dvb.iptv.alfec-base": {"source":"iana"},
	"application/vnd.dvb.iptv.alfec-enhancement": {"source":"iana"},
	"application/vnd.dvb.notif-aggregate-root+xml": {"source":"iana"},
	"application/vnd.dvb.notif-container+xml": {"source":"iana"},
	"application/vnd.dvb.notif-generic+xml": {"source":"iana"},
	"application/vnd.dvb.notif-ia-msglist+xml": {"source":"iana"},
	"application/vnd.dvb.notif-ia-registration-request+xml": {"source":"iana"},
	"application/vnd.dvb.notif-ia-registration-response+xml": {"source":"iana"},
	"application/vnd.dvb.notif-init+xml": {"source":"iana"},
	"application/vnd.dvb.pfr": {"source":"iana"},
	"application/vnd.dvb.service": {"source":"iana","extensions":["svc"]},
	"application/vnd.dxr": {"source":"iana"},
	"application/vnd.dynageo": {"source":"iana","extensions":["geo"]},
	"application/vnd.dzr": {"source":"iana"},
	"application/vnd.easykaraoke.cdgdownload": {"source":"iana"},
	"application/vnd.ecdis-update": {"source":"iana"},
	"application/vnd.ecip.rlp": {"source":"iana"},
	"application/vnd.ecowin.chart": {"source":"iana","extensions":["mag"]},
	"application/vnd.ecowin.filerequest": {"source":"iana"},
	"application/vnd.ecowin.fileupdate": {"source":"iana"},
	"application/vnd.ecowin.series": {"source":"iana"},
	"application/vnd.ecowin.seriesrequest": {"source":"iana"},
	"application/vnd.ecowin.seriesupdate": {"source":"iana"},
	"application/vnd.efi.img": {"source":"iana"},
	"application/vnd.efi.iso": {"source":"iana"},
	"application/vnd.emclient.accessrequest+xml": {"source":"iana"},
	"application/vnd.enliven": {"source":"iana","extensions":["nml"]},
	"application/vnd.enphase.envoy": {"source":"iana"},
	"application/vnd.eprints.data+xml": {"source":"iana"},
	"application/vnd.epson.esf": {"source":"iana","extensions":["esf"]},
	"application/vnd.epson.msf": {"source":"iana","extensions":["msf"]},
	"application/vnd.epson.quickanime": {"source":"iana","extensions":["qam"]},
	"application/vnd.epson.salt": {"source":"iana","extensions":["slt"]},
	"application/vnd.epson.ssf": {"source":"iana","extensions":["ssf"]},
	"application/vnd.ericsson.quickcall": {"source":"iana"},
	"application/vnd.espass-espass+zip": {"source":"iana"},
	"application/vnd.eszigno3+xml": {"source":"iana","extensions":["es3","et3"]},
	"application/vnd.etsi.aoc+xml": {"source":"iana"},
	"application/vnd.etsi.asic-e+zip": {"source":"iana"},
	"application/vnd.etsi.asic-s+zip": {"source":"iana"},
	"application/vnd.etsi.cug+xml": {"source":"iana"},
	"application/vnd.etsi.iptvcommand+xml": {"source":"iana"},
	"application/vnd.etsi.iptvdiscovery+xml": {"source":"iana"},
	"application/vnd.etsi.iptvprofile+xml": {"source":"iana"},
	"application/vnd.etsi.iptvsad-bc+xml": {"source":"iana"},
	"application/vnd.etsi.iptvsad-cod+xml": {"source":"iana"},
	"application/vnd.etsi.iptvsad-npvr+xml": {"source":"iana"},
	"application/vnd.etsi.iptvservice+xml": {"source":"iana"},
	"application/vnd.etsi.iptvsync+xml": {"source":"iana"},
	"application/vnd.etsi.iptvueprofile+xml": {"source":"iana"},
	"application/vnd.etsi.mcid+xml": {"source":"iana"},
	"application/vnd.etsi.mheg5": {"source":"iana"},
	"application/vnd.etsi.overload-control-policy-dataset+xml": {"source":"iana"},
	"application/vnd.etsi.pstn+xml": {"source":"iana"},
	"application/vnd.etsi.sci+xml": {"source":"iana"},
	"application/vnd.etsi.simservs+xml": {"source":"iana"},
	"application/vnd.etsi.timestamp-token": {"source":"iana"},
	"application/vnd.etsi.tsl+xml": {"source":"iana"},
	"application/vnd.etsi.tsl.der": {"source":"iana"},
	"application/vnd.eudora.data": {"source":"iana"},
	"application/vnd.evolv.ecig.profile": {"source":"iana"},
	"application/vnd.evolv.ecig.settings": {"source":"iana"},
	"application/vnd.evolv.ecig.theme": {"source":"iana"},
	"application/vnd.ezpix-album": {"source":"iana","extensions":["ez2"]},
	"application/vnd.ezpix-package": {"source":"iana","extensions":["ez3"]},
	"application/vnd.f-secure.mobile": {"source":"iana"},
	"application/vnd.fastcopy-disk-image": {"source":"iana"},
	"application/vnd.fdf": {"source":"iana","extensions":["fdf"]},
	"application/vnd.fdsn.mseed": {"source":"iana","extensions":["mseed"]},
	"application/vnd.fdsn.seed": {"source":"iana","extensions":["seed","dataless"]},
	"application/vnd.ffsns": {"source":"iana"},
	"application/vnd.filmit.zfc": {"source":"iana"},
	"application/vnd.fints": {"source":"iana"},
	"application/vnd.firemonkeys.cloudcell": {"source":"iana"},
	"application/vnd.flographit": {"source":"iana","extensions":["gph"]},
	"application/vnd.fluxtime.clip": {"source":"iana","extensions":["ftc"]},
	"application/vnd.font-fontforge-sfd": {"source":"iana"},
	"application/vnd.framemaker": {"source":"iana","extensions":["fm","frame","maker","book"]},
	"application/vnd.frogans.fnc": {"source":"iana","extensions":["fnc"]},
	"application/vnd.frogans.ltf": {"source":"iana","extensions":["ltf"]},
	"application/vnd.fsc.weblaunch": {"source":"iana","extensions":["fsc"]},
	"application/vnd.fujitsu.oasys": {"source":"iana","extensions":["oas"]},
	"application/vnd.fujitsu.oasys2": {"source":"iana","extensions":["oa2"]},
	"application/vnd.fujitsu.oasys3": {"source":"iana","extensions":["oa3"]},
	"application/vnd.fujitsu.oasysgp": {"source":"iana","extensions":["fg5"]},
	"application/vnd.fujitsu.oasysprs": {"source":"iana","extensions":["bh2"]},
	"application/vnd.fujixerox.art-ex": {"source":"iana"},
	"application/vnd.fujixerox.art4": {"source":"iana"},
	"application/vnd.fujixerox.ddd": {"source":"iana","extensions":["ddd"]},
	"application/vnd.fujixerox.docuworks": {"source":"iana","extensions":["xdw"]},
	"application/vnd.fujixerox.docuworks.binder": {"source":"iana","extensions":["xbd"]},
	"application/vnd.fujixerox.docuworks.container": {"source":"iana"},
	"application/vnd.fujixerox.hbpl": {"source":"iana"},
	"application/vnd.fut-misnet": {"source":"iana"},
	"application/vnd.fuzzysheet": {"source":"iana","extensions":["fzs"]},
	"application/vnd.genomatix.tuxedo": {"source":"iana","extensions":["txd"]},
	"application/vnd.geo+json": {"source":"iana","compressible":true},
	"application/vnd.geocube+xml": {"source":"iana"},
	"application/vnd.geogebra.file": {"source":"iana","extensions":["ggb"]},
	"application/vnd.geogebra.tool": {"source":"iana","extensions":["ggt"]},
	"application/vnd.geometry-explorer": {"source":"iana","extensions":["gex","gre"]},
	"application/vnd.geonext": {"source":"iana","extensions":["gxt"]},
	"application/vnd.geoplan": {"source":"iana","extensions":["g2w"]},
	"application/vnd.geospace": {"source":"iana","extensions":["g3w"]},
	"application/vnd.gerber": {"source":"iana"},
	"application/vnd.globalplatform.card-content-mgt": {"source":"iana"},
	"application/vnd.globalplatform.card-content-mgt-response": {"source":"iana"},
	"application/vnd.gmx": {"source":"iana","extensions":["gmx"]},
	"application/vnd.google-apps.document": {"compressible":false,"extensions":["gdoc"]},
	"application/vnd.google-apps.presentation": {"compressible":false,"extensions":["gslides"]},
	"application/vnd.google-apps.spreadsheet": {"compressible":false,"extensions":["gsheet"]},
	"application/vnd.google-earth.kml+xml": {"source":"iana","compressible":true,"extensions":["kml"]},
	"application/vnd.google-earth.kmz": {"source":"iana","compressible":false,"extensions":["kmz"]},
	"application/vnd.gov.sk.e-form+xml": {"source":"iana"},
	"application/vnd.gov.sk.e-form+zip": {"source":"iana"},
	"application/vnd.gov.sk.xmldatacontainer+xml": {"source":"iana"},
	"application/vnd.grafeq": {"source":"iana","extensions":["gqf","gqs"]},
	"application/vnd.gridmp": {"source":"iana"},
	"application/vnd.groove-account": {"source":"iana","extensions":["gac"]},
	"application/vnd.groove-help": {"source":"iana","extensions":["ghf"]},
	"application/vnd.groove-identity-message": {"source":"iana","extensions":["gim"]},
	"application/vnd.groove-injector": {"source":"iana","extensions":["grv"]},
	"application/vnd.groove-tool-message": {"source":"iana","extensions":["gtm"]},
	"application/vnd.groove-tool-template": {"source":"iana","extensions":["tpl"]},
	"application/vnd.groove-vcard": {"source":"iana","extensions":["vcg"]},
	"application/vnd.hal+json": {"source":"iana","compressible":true},
	"application/vnd.hal+xml": {"source":"iana","extensions":["hal"]},
	"application/vnd.handheld-entertainment+xml": {"source":"iana","extensions":["zmm"]},
	"application/vnd.hbci": {"source":"iana","extensions":["hbci"]},
	"application/vnd.hc+json": {"source":"iana","compressible":true},
	"application/vnd.hcl-bireports": {"source":"iana"},
	"application/vnd.hdt": {"source":"iana"},
	"application/vnd.heroku+json": {"source":"iana","compressible":true},
	"application/vnd.hhe.lesson-player": {"source":"iana","extensions":["les"]},
	"application/vnd.hp-hpgl": {"source":"iana","extensions":["hpgl"]},
	"application/vnd.hp-hpid": {"source":"iana","extensions":["hpid"]},
	"application/vnd.hp-hps": {"source":"iana","extensions":["hps"]},
	"application/vnd.hp-jlyt": {"source":"iana","extensions":["jlt"]},
	"application/vnd.hp-pcl": {"source":"iana","extensions":["pcl"]},
	"application/vnd.hp-pclxl": {"source":"iana","extensions":["pclxl"]},
	"application/vnd.httphone": {"source":"iana"},
	"application/vnd.hydrostatix.sof-data": {"source":"iana","extensions":["sfd-hdstx"]},
	"application/vnd.hyper-item+json": {"source":"iana","compressible":true},
	"application/vnd.hyperdrive+json": {"source":"iana","compressible":true},
	"application/vnd.hzn-3d-crossword": {"source":"iana"},
	"application/vnd.ibm.afplinedata": {"source":"iana"},
	"application/vnd.ibm.electronic-media": {"source":"iana"},
	"application/vnd.ibm.minipay": {"source":"iana","extensions":["mpy"]},
	"application/vnd.ibm.modcap": {"source":"iana","extensions":["afp","listafp","list3820"]},
	"application/vnd.ibm.rights-management": {"source":"iana","extensions":["irm"]},
	"application/vnd.ibm.secure-container": {"source":"iana","extensions":["sc"]},
	"application/vnd.iccprofile": {"source":"iana","extensions":["icc","icm"]},
	"application/vnd.ieee.1905": {"source":"iana"},
	"application/vnd.igloader": {"source":"iana","extensions":["igl"]},
	"application/vnd.imagemeter.folder+zip": {"source":"iana"},
	"application/vnd.imagemeter.image+zip": {"source":"iana"},
	"application/vnd.immervision-ivp": {"source":"iana","extensions":["ivp"]},
	"application/vnd.immervision-ivu": {"source":"iana","extensions":["ivu"]},
	"application/vnd.ims.imsccv1p1": {"source":"iana"},
	"application/vnd.ims.imsccv1p2": {"source":"iana"},
	"application/vnd.ims.imsccv1p3": {"source":"iana"},
	"application/vnd.ims.lis.v2.result+json": {"source":"iana","compressible":true},
	"application/vnd.ims.lti.v2.toolconsumerprofile+json": {"source":"iana","compressible":true},
	"application/vnd.ims.lti.v2.toolproxy+json": {"source":"iana","compressible":true},
	"application/vnd.ims.lti.v2.toolproxy.id+json": {"source":"iana","compressible":true},
	"application/vnd.ims.lti.v2.toolsettings+json": {"source":"iana","compressible":true},
	"application/vnd.ims.lti.v2.toolsettings.simple+json": {"source":"iana","compressible":true},
	"application/vnd.informedcontrol.rms+xml": {"source":"iana"},
	"application/vnd.informix-visionary": {"source":"iana"},
	"application/vnd.infotech.project": {"source":"iana"},
	"application/vnd.infotech.project+xml": {"source":"iana"},
	"application/vnd.innopath.wamp.notification": {"source":"iana"},
	"application/vnd.insors.igm": {"source":"iana","extensions":["igm"]},
	"application/vnd.intercon.formnet": {"source":"iana","extensions":["xpw","xpx"]},
	"application/vnd.intergeo": {"source":"iana","extensions":["i2g"]},
	"application/vnd.intertrust.digibox": {"source":"iana"},
	"application/vnd.intertrust.nncp": {"source":"iana"},
	"application/vnd.intu.qbo": {"source":"iana","extensions":["qbo"]},
	"application/vnd.intu.qfx": {"source":"iana","extensions":["qfx"]},
	"application/vnd.iptc.g2.catalogitem+xml": {"source":"iana"},
	"application/vnd.iptc.g2.conceptitem+xml": {"source":"iana"},
	"application/vnd.iptc.g2.knowledgeitem+xml": {"source":"iana"},
	"application/vnd.iptc.g2.newsitem+xml": {"source":"iana"},
	"application/vnd.iptc.g2.newsmessage+xml": {"source":"iana"},
	"application/vnd.iptc.g2.packageitem+xml": {"source":"iana"},
	"application/vnd.iptc.g2.planningitem+xml": {"source":"iana"},
	"application/vnd.ipunplugged.rcprofile": {"source":"iana","extensions":["rcprofile"]},
	"application/vnd.irepository.package+xml": {"source":"iana","extensions":["irp"]},
	"application/vnd.is-xpr": {"source":"iana","extensions":["xpr"]},
	"application/vnd.isac.fcs": {"source":"iana","extensions":["fcs"]},
	"application/vnd.jam": {"source":"iana","extensions":["jam"]},
	"application/vnd.japannet-directory-service": {"source":"iana"},
	"application/vnd.japannet-jpnstore-wakeup": {"source":"iana"},
	"application/vnd.japannet-payment-wakeup": {"source":"iana"},
	"application/vnd.japannet-registration": {"source":"iana"},
	"application/vnd.japannet-registration-wakeup": {"source":"iana"},
	"application/vnd.japannet-setstore-wakeup": {"source":"iana"},
	"application/vnd.japannet-verification": {"source":"iana"},
	"application/vnd.japannet-verification-wakeup": {"source":"iana"},
	"application/vnd.jcp.javame.midlet-rms": {"source":"iana","extensions":["rms"]},
	"application/vnd.jisp": {"source":"iana","extensions":["jisp"]},
	"application/vnd.joost.joda-archive": {"source":"iana","extensions":["joda"]},
	"application/vnd.jsk.isdn-ngn": {"source":"iana"},
	"application/vnd.kahootz": {"source":"iana","extensions":["ktz","ktr"]},
	"application/vnd.kde.karbon": {"source":"iana","extensions":["karbon"]},
	"application/vnd.kde.kchart": {"source":"iana","extensions":["chrt"]},
	"application/vnd.kde.kformula": {"source":"iana","extensions":["kfo"]},
	"application/vnd.kde.kivio": {"source":"iana","extensions":["flw"]},
	"application/vnd.kde.kontour": {"source":"iana","extensions":["kon"]},
	"application/vnd.kde.kpresenter": {"source":"iana","extensions":["kpr","kpt"]},
	"application/vnd.kde.kspread": {"source":"iana","extensions":["ksp"]},
	"application/vnd.kde.kword": {"source":"iana","extensions":["kwd","kwt"]},
	"application/vnd.kenameaapp": {"source":"iana","extensions":["htke"]},
	"application/vnd.kidspiration": {"source":"iana","extensions":["kia"]},
	"application/vnd.kinar": {"source":"iana","extensions":["kne","knp"]},
	"application/vnd.koan": {"source":"iana","extensions":["skp","skd","skt","skm"]},
	"application/vnd.kodak-descriptor": {"source":"iana","extensions":["sse"]},
	"application/vnd.las.las+json": {"source":"iana","compressible":true},
	"application/vnd.las.las+xml": {"source":"iana","extensions":["lasxml"]},
	"application/vnd.liberty-request+xml": {"source":"iana"},
	"application/vnd.llamagraphics.life-balance.desktop": {"source":"iana","extensions":["lbd"]},
	"application/vnd.llamagraphics.life-balance.exchange+xml": {"source":"iana","extensions":["lbe"]},
	"application/vnd.lotus-1-2-3": {"source":"iana","extensions":["123"]},
	"application/vnd.lotus-approach": {"source":"iana","extensions":["apr"]},
	"application/vnd.lotus-freelance": {"source":"iana","extensions":["pre"]},
	"application/vnd.lotus-notes": {"source":"iana","extensions":["nsf"]},
	"application/vnd.lotus-organizer": {"source":"iana","extensions":["org"]},
	"application/vnd.lotus-screencam": {"source":"iana","extensions":["scm"]},
	"application/vnd.lotus-wordpro": {"source":"iana","extensions":["lwp"]},
	"application/vnd.macports.portpkg": {"source":"iana","extensions":["portpkg"]},
	"application/vnd.mapbox-vector-tile": {"source":"iana"},
	"application/vnd.marlin.drm.actiontoken+xml": {"source":"iana"},
	"application/vnd.marlin.drm.conftoken+xml": {"source":"iana"},
	"application/vnd.marlin.drm.license+xml": {"source":"iana"},
	"application/vnd.marlin.drm.mdcf": {"source":"iana"},
	"application/vnd.mason+json": {"source":"iana","compressible":true},
	"application/vnd.maxmind.maxmind-db": {"source":"iana"},
	"application/vnd.mcd": {"source":"iana","extensions":["mcd"]},
	"application/vnd.medcalcdata": {"source":"iana","extensions":["mc1"]},
	"application/vnd.mediastation.cdkey": {"source":"iana","extensions":["cdkey"]},
	"application/vnd.meridian-slingshot": {"source":"iana"},
	"application/vnd.mfer": {"source":"iana","extensions":["mwf"]},
	"application/vnd.mfmp": {"source":"iana","extensions":["mfm"]},
	"application/vnd.micro+json": {"source":"iana","compressible":true},
	"application/vnd.micrografx.flo": {"source":"iana","extensions":["flo"]},
	"application/vnd.micrografx.igx": {"source":"iana","extensions":["igx"]},
	"application/vnd.microsoft.portable-executable": {"source":"iana"},
	"application/vnd.microsoft.windows.thumbnail-cache": {"source":"iana"},
	"application/vnd.miele+json": {"source":"iana","compressible":true},
	"application/vnd.mif": {"source":"iana","extensions":["mif"]},
	"application/vnd.minisoft-hp3000-save": {"source":"iana"},
	"application/vnd.mitsubishi.misty-guard.trustweb": {"source":"iana"},
	"application/vnd.mobius.daf": {"source":"iana","extensions":["daf"]},
	"application/vnd.mobius.dis": {"source":"iana","extensions":["dis"]},
	"application/vnd.mobius.mbk": {"source":"iana","extensions":["mbk"]},
	"application/vnd.mobius.mqy": {"source":"iana","extensions":["mqy"]},
	"application/vnd.mobius.msl": {"source":"iana","extensions":["msl"]},
	"application/vnd.mobius.plc": {"source":"iana","extensions":["plc"]},
	"application/vnd.mobius.txf": {"source":"iana","extensions":["txf"]},
	"application/vnd.mophun.application": {"source":"iana","extensions":["mpn"]},
	"application/vnd.mophun.certificate": {"source":"iana","extensions":["mpc"]},
	"application/vnd.motorola.flexsuite": {"source":"iana"},
	"application/vnd.motorola.flexsuite.adsi": {"source":"iana"},
	"application/vnd.motorola.flexsuite.fis": {"source":"iana"},
	"application/vnd.motorola.flexsuite.gotap": {"source":"iana"},
	"application/vnd.motorola.flexsuite.kmr": {"source":"iana"},
	"application/vnd.motorola.flexsuite.ttc": {"source":"iana"},
	"application/vnd.motorola.flexsuite.wem": {"source":"iana"},
	"application/vnd.motorola.iprm": {"source":"iana"},
	"application/vnd.mozilla.xul+xml": {"source":"iana","compressible":true,"extensions":["xul"]},
	"application/vnd.ms-3mfdocument": {"source":"iana"},
	"application/vnd.ms-artgalry": {"source":"iana","extensions":["cil"]},
	"application/vnd.ms-asf": {"source":"iana"},
	"application/vnd.ms-cab-compressed": {"source":"iana","extensions":["cab"]},
	"application/vnd.ms-color.iccprofile": {"source":"apache"},
	"application/vnd.ms-excel": {"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},
	"application/vnd.ms-excel.addin.macroenabled.12": {"source":"iana","extensions":["xlam"]},
	"application/vnd.ms-excel.sheet.binary.macroenabled.12": {"source":"iana","extensions":["xlsb"]},
	"application/vnd.ms-excel.sheet.macroenabled.12": {"source":"iana","extensions":["xlsm"]},
	"application/vnd.ms-excel.template.macroenabled.12": {"source":"iana","extensions":["xltm"]},
	"application/vnd.ms-fontobject": {"source":"iana","compressible":true,"extensions":["eot"]},
	"application/vnd.ms-htmlhelp": {"source":"iana","extensions":["chm"]},
	"application/vnd.ms-ims": {"source":"iana","extensions":["ims"]},
	"application/vnd.ms-lrm": {"source":"iana","extensions":["lrm"]},
	"application/vnd.ms-office.activex+xml": {"source":"iana"},
	"application/vnd.ms-officetheme": {"source":"iana","extensions":["thmx"]},
	"application/vnd.ms-opentype": {"source":"apache","compressible":true},
	"application/vnd.ms-outlook": {"compressible":false,"extensions":["msg"]},
	"application/vnd.ms-package.obfuscated-opentype": {"source":"apache"},
	"application/vnd.ms-pki.seccat": {"source":"apache","extensions":["cat"]},
	"application/vnd.ms-pki.stl": {"source":"apache","extensions":["stl"]},
	"application/vnd.ms-playready.initiator+xml": {"source":"iana"},
	"application/vnd.ms-powerpoint": {"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},
	"application/vnd.ms-powerpoint.addin.macroenabled.12": {"source":"iana","extensions":["ppam"]},
	"application/vnd.ms-powerpoint.presentation.macroenabled.12": {"source":"iana","extensions":["pptm"]},
	"application/vnd.ms-powerpoint.slide.macroenabled.12": {"source":"iana","extensions":["sldm"]},
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {"source":"iana","extensions":["ppsm"]},
	"application/vnd.ms-powerpoint.template.macroenabled.12": {"source":"iana","extensions":["potm"]},
	"application/vnd.ms-printdevicecapabilities+xml": {"source":"iana"},
	"application/vnd.ms-printing.printticket+xml": {"source":"apache"},
	"application/vnd.ms-printschematicket+xml": {"source":"iana"},
	"application/vnd.ms-project": {"source":"iana","extensions":["mpp","mpt"]},
	"application/vnd.ms-tnef": {"source":"iana"},
	"application/vnd.ms-windows.devicepairing": {"source":"iana"},
	"application/vnd.ms-windows.nwprinting.oob": {"source":"iana"},
	"application/vnd.ms-windows.printerpairing": {"source":"iana"},
	"application/vnd.ms-windows.wsd.oob": {"source":"iana"},
	"application/vnd.ms-wmdrm.lic-chlg-req": {"source":"iana"},
	"application/vnd.ms-wmdrm.lic-resp": {"source":"iana"},
	"application/vnd.ms-wmdrm.meter-chlg-req": {"source":"iana"},
	"application/vnd.ms-wmdrm.meter-resp": {"source":"iana"},
	"application/vnd.ms-word.document.macroenabled.12": {"source":"iana","extensions":["docm"]},
	"application/vnd.ms-word.template.macroenabled.12": {"source":"iana","extensions":["dotm"]},
	"application/vnd.ms-works": {"source":"iana","extensions":["wps","wks","wcm","wdb"]},
	"application/vnd.ms-wpl": {"source":"iana","extensions":["wpl"]},
	"application/vnd.ms-xpsdocument": {"source":"iana","compressible":false,"extensions":["xps"]},
	"application/vnd.msa-disk-image": {"source":"iana"},
	"application/vnd.mseq": {"source":"iana","extensions":["mseq"]},
	"application/vnd.msign": {"source":"iana"},
	"application/vnd.multiad.creator": {"source":"iana"},
	"application/vnd.multiad.creator.cif": {"source":"iana"},
	"application/vnd.music-niff": {"source":"iana"},
	"application/vnd.musician": {"source":"iana","extensions":["mus"]},
	"application/vnd.muvee.style": {"source":"iana","extensions":["msty"]},
	"application/vnd.mynfc": {"source":"iana","extensions":["taglet"]},
	"application/vnd.ncd.control": {"source":"iana"},
	"application/vnd.ncd.reference": {"source":"iana"},
	"application/vnd.nearst.inv+json": {"source":"iana","compressible":true},
	"application/vnd.nervana": {"source":"iana"},
	"application/vnd.netfpx": {"source":"iana"},
	"application/vnd.neurolanguage.nlu": {"source":"iana","extensions":["nlu"]},
	"application/vnd.nintendo.nitro.rom": {"source":"iana"},
	"application/vnd.nintendo.snes.rom": {"source":"iana"},
	"application/vnd.nitf": {"source":"iana","extensions":["ntf","nitf"]},
	"application/vnd.noblenet-directory": {"source":"iana","extensions":["nnd"]},
	"application/vnd.noblenet-sealer": {"source":"iana","extensions":["nns"]},
	"application/vnd.noblenet-web": {"source":"iana","extensions":["nnw"]},
	"application/vnd.nokia.catalogs": {"source":"iana"},
	"application/vnd.nokia.conml+wbxml": {"source":"iana"},
	"application/vnd.nokia.conml+xml": {"source":"iana"},
	"application/vnd.nokia.iptv.config+xml": {"source":"iana"},
	"application/vnd.nokia.isds-radio-presets": {"source":"iana"},
	"application/vnd.nokia.landmark+wbxml": {"source":"iana"},
	"application/vnd.nokia.landmark+xml": {"source":"iana"},
	"application/vnd.nokia.landmarkcollection+xml": {"source":"iana"},
	"application/vnd.nokia.n-gage.ac+xml": {"source":"iana"},
	"application/vnd.nokia.n-gage.data": {"source":"iana","extensions":["ngdat"]},
	"application/vnd.nokia.n-gage.symbian.install": {"source":"iana","extensions":["n-gage"]},
	"application/vnd.nokia.ncd": {"source":"iana"},
	"application/vnd.nokia.pcd+wbxml": {"source":"iana"},
	"application/vnd.nokia.pcd+xml": {"source":"iana"},
	"application/vnd.nokia.radio-preset": {"source":"iana","extensions":["rpst"]},
	"application/vnd.nokia.radio-presets": {"source":"iana","extensions":["rpss"]},
	"application/vnd.novadigm.edm": {"source":"iana","extensions":["edm"]},
	"application/vnd.novadigm.edx": {"source":"iana","extensions":["edx"]},
	"application/vnd.novadigm.ext": {"source":"iana","extensions":["ext"]},
	"application/vnd.ntt-local.content-share": {"source":"iana"},
	"application/vnd.ntt-local.file-transfer": {"source":"iana"},
	"application/vnd.ntt-local.ogw_remote-access": {"source":"iana"},
	"application/vnd.ntt-local.sip-ta_remote": {"source":"iana"},
	"application/vnd.ntt-local.sip-ta_tcp_stream": {"source":"iana"},
	"application/vnd.oasis.opendocument.chart": {"source":"iana","extensions":["odc"]},
	"application/vnd.oasis.opendocument.chart-template": {"source":"iana","extensions":["otc"]},
	"application/vnd.oasis.opendocument.database": {"source":"iana","extensions":["odb"]},
	"application/vnd.oasis.opendocument.formula": {"source":"iana","extensions":["odf"]},
	"application/vnd.oasis.opendocument.formula-template": {"source":"iana","extensions":["odft"]},
	"application/vnd.oasis.opendocument.graphics": {"source":"iana","compressible":false,"extensions":["odg"]},
	"application/vnd.oasis.opendocument.graphics-template": {"source":"iana","extensions":["otg"]},
	"application/vnd.oasis.opendocument.image": {"source":"iana","extensions":["odi"]},
	"application/vnd.oasis.opendocument.image-template": {"source":"iana","extensions":["oti"]},
	"application/vnd.oasis.opendocument.presentation": {"source":"iana","compressible":false,"extensions":["odp"]},
	"application/vnd.oasis.opendocument.presentation-template": {"source":"iana","extensions":["otp"]},
	"application/vnd.oasis.opendocument.spreadsheet": {"source":"iana","compressible":false,"extensions":["ods"]},
	"application/vnd.oasis.opendocument.spreadsheet-template": {"source":"iana","extensions":["ots"]},
	"application/vnd.oasis.opendocument.text": {"source":"iana","compressible":false,"extensions":["odt"]},
	"application/vnd.oasis.opendocument.text-master": {"source":"iana","extensions":["odm"]},
	"application/vnd.oasis.opendocument.text-template": {"source":"iana","extensions":["ott"]},
	"application/vnd.oasis.opendocument.text-web": {"source":"iana","extensions":["oth"]},
	"application/vnd.obn": {"source":"iana"},
	"application/vnd.ocf+cbor": {"source":"iana"},
	"application/vnd.oftn.l10n+json": {"source":"iana","compressible":true},
	"application/vnd.oipf.contentaccessdownload+xml": {"source":"iana"},
	"application/vnd.oipf.contentaccessstreaming+xml": {"source":"iana"},
	"application/vnd.oipf.cspg-hexbinary": {"source":"iana"},
	"application/vnd.oipf.dae.svg+xml": {"source":"iana"},
	"application/vnd.oipf.dae.xhtml+xml": {"source":"iana"},
	"application/vnd.oipf.mippvcontrolmessage+xml": {"source":"iana"},
	"application/vnd.oipf.pae.gem": {"source":"iana"},
	"application/vnd.oipf.spdiscovery+xml": {"source":"iana"},
	"application/vnd.oipf.spdlist+xml": {"source":"iana"},
	"application/vnd.oipf.ueprofile+xml": {"source":"iana"},
	"application/vnd.oipf.userprofile+xml": {"source":"iana"},
	"application/vnd.olpc-sugar": {"source":"iana","extensions":["xo"]},
	"application/vnd.oma-scws-config": {"source":"iana"},
	"application/vnd.oma-scws-http-request": {"source":"iana"},
	"application/vnd.oma-scws-http-response": {"source":"iana"},
	"application/vnd.oma.bcast.associated-procedure-parameter+xml": {"source":"iana"},
	"application/vnd.oma.bcast.drm-trigger+xml": {"source":"iana"},
	"application/vnd.oma.bcast.imd+xml": {"source":"iana"},
	"application/vnd.oma.bcast.ltkm": {"source":"iana"},
	"application/vnd.oma.bcast.notification+xml": {"source":"iana"},
	"application/vnd.oma.bcast.provisioningtrigger": {"source":"iana"},
	"application/vnd.oma.bcast.sgboot": {"source":"iana"},
	"application/vnd.oma.bcast.sgdd+xml": {"source":"iana"},
	"application/vnd.oma.bcast.sgdu": {"source":"iana"},
	"application/vnd.oma.bcast.simple-symbol-container": {"source":"iana"},
	"application/vnd.oma.bcast.smartcard-trigger+xml": {"source":"iana"},
	"application/vnd.oma.bcast.sprov+xml": {"source":"iana"},
	"application/vnd.oma.bcast.stkm": {"source":"iana"},
	"application/vnd.oma.cab-address-book+xml": {"source":"iana"},
	"application/vnd.oma.cab-feature-handler+xml": {"source":"iana"},
	"application/vnd.oma.cab-pcc+xml": {"source":"iana"},
	"application/vnd.oma.cab-subs-invite+xml": {"source":"iana"},
	"application/vnd.oma.cab-user-prefs+xml": {"source":"iana"},
	"application/vnd.oma.dcd": {"source":"iana"},
	"application/vnd.oma.dcdc": {"source":"iana"},
	"application/vnd.oma.dd2+xml": {"source":"iana","extensions":["dd2"]},
	"application/vnd.oma.drm.risd+xml": {"source":"iana"},
	"application/vnd.oma.group-usage-list+xml": {"source":"iana"},
	"application/vnd.oma.lwm2m+json": {"source":"iana","compressible":true},
	"application/vnd.oma.lwm2m+tlv": {"source":"iana"},
	"application/vnd.oma.pal+xml": {"source":"iana"},
	"application/vnd.oma.poc.detailed-progress-report+xml": {"source":"iana"},
	"application/vnd.oma.poc.final-report+xml": {"source":"iana"},
	"application/vnd.oma.poc.groups+xml": {"source":"iana"},
	"application/vnd.oma.poc.invocation-descriptor+xml": {"source":"iana"},
	"application/vnd.oma.poc.optimized-progress-report+xml": {"source":"iana"},
	"application/vnd.oma.push": {"source":"iana"},
	"application/vnd.oma.scidm.messages+xml": {"source":"iana"},
	"application/vnd.oma.xcap-directory+xml": {"source":"iana"},
	"application/vnd.omads-email+xml": {"source":"iana"},
	"application/vnd.omads-file+xml": {"source":"iana"},
	"application/vnd.omads-folder+xml": {"source":"iana"},
	"application/vnd.omaloc-supl-init": {"source":"iana"},
	"application/vnd.onepager": {"source":"iana"},
	"application/vnd.onepagertamp": {"source":"iana"},
	"application/vnd.onepagertamx": {"source":"iana"},
	"application/vnd.onepagertat": {"source":"iana"},
	"application/vnd.onepagertatp": {"source":"iana"},
	"application/vnd.onepagertatx": {"source":"iana"},
	"application/vnd.openblox.game+xml": {"source":"iana"},
	"application/vnd.openblox.game-binary": {"source":"iana"},
	"application/vnd.openeye.oeb": {"source":"iana"},
	"application/vnd.openofficeorg.extension": {"source":"apache","extensions":["oxt"]},
	"application/vnd.openstreetmap.data+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.custom-properties+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.drawing+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.extended-properties+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": {"source":"iana","compressible":false,"extensions":["pptx"]},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.slide": {"source":"iana","extensions":["sldx"]},
	"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {"source":"iana","extensions":["ppsx"]},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.template": {"source":"iana","extensions":["potx"]},
	"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {"source":"iana","compressible":false,"extensions":["xlsx"]},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {"source":"iana","extensions":["xltx"]},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.theme+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.themeoverride+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.vmldrawing": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {"source":"iana","compressible":false,"extensions":["docx"]},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {"source":"iana","extensions":["dotx"]},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {"source":"iana"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {"source":"iana"},
	"application/vnd.openxmlformats-package.core-properties+xml": {"source":"iana"},
	"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {"source":"iana"},
	"application/vnd.openxmlformats-package.relationships+xml": {"source":"iana"},
	"application/vnd.oracle.resource+json": {"source":"iana","compressible":true},
	"application/vnd.orange.indata": {"source":"iana"},
	"application/vnd.osa.netdeploy": {"source":"iana"},
	"application/vnd.osgeo.mapguide.package": {"source":"iana","extensions":["mgp"]},
	"application/vnd.osgi.bundle": {"source":"iana"},
	"application/vnd.osgi.dp": {"source":"iana","extensions":["dp"]},
	"application/vnd.osgi.subsystem": {"source":"iana","extensions":["esa"]},
	"application/vnd.otps.ct-kip+xml": {"source":"iana"},
	"application/vnd.oxli.countgraph": {"source":"iana"},
	"application/vnd.pagerduty+json": {"source":"iana","compressible":true},
	"application/vnd.palm": {"source":"iana","extensions":["pdb","pqa","oprc"]},
	"application/vnd.panoply": {"source":"iana"},
	"application/vnd.paos+xml": {"source":"iana"},
	"application/vnd.paos.xml": {"source":"apache"},
	"application/vnd.patentdive": {"source":"iana"},
	"application/vnd.pawaafile": {"source":"iana","extensions":["paw"]},
	"application/vnd.pcos": {"source":"iana"},
	"application/vnd.pg.format": {"source":"iana","extensions":["str"]},
	"application/vnd.pg.osasli": {"source":"iana","extensions":["ei6"]},
	"application/vnd.piaccess.application-licence": {"source":"iana"},
	"application/vnd.picsel": {"source":"iana","extensions":["efif"]},
	"application/vnd.pmi.widget": {"source":"iana","extensions":["wg"]},
	"application/vnd.poc.group-advertisement+xml": {"source":"iana"},
	"application/vnd.pocketlearn": {"source":"iana","extensions":["plf"]},
	"application/vnd.powerbuilder6": {"source":"iana","extensions":["pbd"]},
	"application/vnd.powerbuilder6-s": {"source":"iana"},
	"application/vnd.powerbuilder7": {"source":"iana"},
	"application/vnd.powerbuilder7-s": {"source":"iana"},
	"application/vnd.powerbuilder75": {"source":"iana"},
	"application/vnd.powerbuilder75-s": {"source":"iana"},
	"application/vnd.preminet": {"source":"iana"},
	"application/vnd.previewsystems.box": {"source":"iana","extensions":["box"]},
	"application/vnd.proteus.magazine": {"source":"iana","extensions":["mgz"]},
	"application/vnd.publishare-delta-tree": {"source":"iana","extensions":["qps"]},
	"application/vnd.pvi.ptid1": {"source":"iana","extensions":["ptid"]},
	"application/vnd.pwg-multiplexed": {"source":"iana"},
	"application/vnd.pwg-xhtml-print+xml": {"source":"iana"},
	"application/vnd.qualcomm.brew-app-res": {"source":"iana"},
	"application/vnd.quarantainenet": {"source":"iana"},
	"application/vnd.quark.quarkxpress": {"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},
	"application/vnd.quobject-quoxdocument": {"source":"iana"},
	"application/vnd.radisys.moml+xml": {"source":"iana"},
	"application/vnd.radisys.msml+xml": {"source":"iana"},
	"application/vnd.radisys.msml-audit+xml": {"source":"iana"},
	"application/vnd.radisys.msml-audit-conf+xml": {"source":"iana"},
	"application/vnd.radisys.msml-audit-conn+xml": {"source":"iana"},
	"application/vnd.radisys.msml-audit-dialog+xml": {"source":"iana"},
	"application/vnd.radisys.msml-audit-stream+xml": {"source":"iana"},
	"application/vnd.radisys.msml-conf+xml": {"source":"iana"},
	"application/vnd.radisys.msml-dialog+xml": {"source":"iana"},
	"application/vnd.radisys.msml-dialog-base+xml": {"source":"iana"},
	"application/vnd.radisys.msml-dialog-fax-detect+xml": {"source":"iana"},
	"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {"source":"iana"},
	"application/vnd.radisys.msml-dialog-group+xml": {"source":"iana"},
	"application/vnd.radisys.msml-dialog-speech+xml": {"source":"iana"},
	"application/vnd.radisys.msml-dialog-transform+xml": {"source":"iana"},
	"application/vnd.rainstor.data": {"source":"iana"},
	"application/vnd.rapid": {"source":"iana"},
	"application/vnd.rar": {"source":"iana"},
	"application/vnd.realvnc.bed": {"source":"iana","extensions":["bed"]},
	"application/vnd.recordare.musicxml": {"source":"iana","extensions":["mxl"]},
	"application/vnd.recordare.musicxml+xml": {"source":"iana","extensions":["musicxml"]},
	"application/vnd.renlearn.rlprint": {"source":"iana"},
	"application/vnd.restful+json": {"source":"iana","compressible":true},
	"application/vnd.rig.cryptonote": {"source":"iana","extensions":["cryptonote"]},
	"application/vnd.rim.cod": {"source":"apache","extensions":["cod"]},
	"application/vnd.rn-realmedia": {"source":"apache","extensions":["rm"]},
	"application/vnd.rn-realmedia-vbr": {"source":"apache","extensions":["rmvb"]},
	"application/vnd.route66.link66+xml": {"source":"iana","extensions":["link66"]},
	"application/vnd.rs-274x": {"source":"iana"},
	"application/vnd.ruckus.download": {"source":"iana"},
	"application/vnd.s3sms": {"source":"iana"},
	"application/vnd.sailingtracker.track": {"source":"iana","extensions":["st"]},
	"application/vnd.sbm.cid": {"source":"iana"},
	"application/vnd.sbm.mid2": {"source":"iana"},
	"application/vnd.scribus": {"source":"iana"},
	"application/vnd.sealed.3df": {"source":"iana"},
	"application/vnd.sealed.csf": {"source":"iana"},
	"application/vnd.sealed.doc": {"source":"iana"},
	"application/vnd.sealed.eml": {"source":"iana"},
	"application/vnd.sealed.mht": {"source":"iana"},
	"application/vnd.sealed.net": {"source":"iana"},
	"application/vnd.sealed.ppt": {"source":"iana"},
	"application/vnd.sealed.tiff": {"source":"iana"},
	"application/vnd.sealed.xls": {"source":"iana"},
	"application/vnd.sealedmedia.softseal.html": {"source":"iana"},
	"application/vnd.sealedmedia.softseal.pdf": {"source":"iana"},
	"application/vnd.seemail": {"source":"iana","extensions":["see"]},
	"application/vnd.sema": {"source":"iana","extensions":["sema"]},
	"application/vnd.semd": {"source":"iana","extensions":["semd"]},
	"application/vnd.semf": {"source":"iana","extensions":["semf"]},
	"application/vnd.shana.informed.formdata": {"source":"iana","extensions":["ifm"]},
	"application/vnd.shana.informed.formtemplate": {"source":"iana","extensions":["itp"]},
	"application/vnd.shana.informed.interchange": {"source":"iana","extensions":["iif"]},
	"application/vnd.shana.informed.package": {"source":"iana","extensions":["ipk"]},
	"application/vnd.sigrok.session": {"source":"iana"},
	"application/vnd.simtech-mindmapper": {"source":"iana","extensions":["twd","twds"]},
	"application/vnd.siren+json": {"source":"iana","compressible":true},
	"application/vnd.smaf": {"source":"iana","extensions":["mmf"]},
	"application/vnd.smart.notebook": {"source":"iana"},
	"application/vnd.smart.teacher": {"source":"iana","extensions":["teacher"]},
	"application/vnd.software602.filler.form+xml": {"source":"iana"},
	"application/vnd.software602.filler.form-xml-zip": {"source":"iana"},
	"application/vnd.solent.sdkm+xml": {"source":"iana","extensions":["sdkm","sdkd"]},
	"application/vnd.spotfire.dxp": {"source":"iana","extensions":["dxp"]},
	"application/vnd.spotfire.sfs": {"source":"iana","extensions":["sfs"]},
	"application/vnd.sqlite3": {"source":"iana"},
	"application/vnd.sss-cod": {"source":"iana"},
	"application/vnd.sss-dtf": {"source":"iana"},
	"application/vnd.sss-ntf": {"source":"iana"},
	"application/vnd.stardivision.calc": {"source":"apache","extensions":["sdc"]},
	"application/vnd.stardivision.draw": {"source":"apache","extensions":["sda"]},
	"application/vnd.stardivision.impress": {"source":"apache","extensions":["sdd"]},
	"application/vnd.stardivision.math": {"source":"apache","extensions":["smf"]},
	"application/vnd.stardivision.writer": {"source":"apache","extensions":["sdw","vor"]},
	"application/vnd.stardivision.writer-global": {"source":"apache","extensions":["sgl"]},
	"application/vnd.stepmania.package": {"source":"iana","extensions":["smzip"]},
	"application/vnd.stepmania.stepchart": {"source":"iana","extensions":["sm"]},
	"application/vnd.street-stream": {"source":"iana"},
	"application/vnd.sun.wadl+xml": {"source":"iana","compressible":true,"extensions":["wadl"]},
	"application/vnd.sun.xml.calc": {"source":"apache","extensions":["sxc"]},
	"application/vnd.sun.xml.calc.template": {"source":"apache","extensions":["stc"]},
	"application/vnd.sun.xml.draw": {"source":"apache","extensions":["sxd"]},
	"application/vnd.sun.xml.draw.template": {"source":"apache","extensions":["std"]},
	"application/vnd.sun.xml.impress": {"source":"apache","extensions":["sxi"]},
	"application/vnd.sun.xml.impress.template": {"source":"apache","extensions":["sti"]},
	"application/vnd.sun.xml.math": {"source":"apache","extensions":["sxm"]},
	"application/vnd.sun.xml.writer": {"source":"apache","extensions":["sxw"]},
	"application/vnd.sun.xml.writer.global": {"source":"apache","extensions":["sxg"]},
	"application/vnd.sun.xml.writer.template": {"source":"apache","extensions":["stw"]},
	"application/vnd.sus-calendar": {"source":"iana","extensions":["sus","susp"]},
	"application/vnd.svd": {"source":"iana","extensions":["svd"]},
	"application/vnd.swiftview-ics": {"source":"iana"},
	"application/vnd.symbian.install": {"source":"apache","extensions":["sis","sisx"]},
	"application/vnd.syncml+xml": {"source":"iana","extensions":["xsm"]},
	"application/vnd.syncml.dm+wbxml": {"source":"iana","extensions":["bdm"]},
	"application/vnd.syncml.dm+xml": {"source":"iana","extensions":["xdm"]},
	"application/vnd.syncml.dm.notification": {"source":"iana"},
	"application/vnd.syncml.dmddf+wbxml": {"source":"iana"},
	"application/vnd.syncml.dmddf+xml": {"source":"iana"},
	"application/vnd.syncml.dmtnds+wbxml": {"source":"iana"},
	"application/vnd.syncml.dmtnds+xml": {"source":"iana"},
	"application/vnd.syncml.ds.notification": {"source":"iana"},
	"application/vnd.tableschema+json": {"source":"iana","compressible":true},
	"application/vnd.tao.intent-module-archive": {"source":"iana","extensions":["tao"]},
	"application/vnd.tcpdump.pcap": {"source":"iana","extensions":["pcap","cap","dmp"]},
	"application/vnd.tmd.mediaflex.api+xml": {"source":"iana"},
	"application/vnd.tml": {"source":"iana"},
	"application/vnd.tmobile-livetv": {"source":"iana","extensions":["tmo"]},
	"application/vnd.tri.onesource": {"source":"iana"},
	"application/vnd.trid.tpt": {"source":"iana","extensions":["tpt"]},
	"application/vnd.triscape.mxs": {"source":"iana","extensions":["mxs"]},
	"application/vnd.trueapp": {"source":"iana","extensions":["tra"]},
	"application/vnd.truedoc": {"source":"iana"},
	"application/vnd.ubisoft.webplayer": {"source":"iana"},
	"application/vnd.ufdl": {"source":"iana","extensions":["ufd","ufdl"]},
	"application/vnd.uiq.theme": {"source":"iana","extensions":["utz"]},
	"application/vnd.umajin": {"source":"iana","extensions":["umj"]},
	"application/vnd.unity": {"source":"iana","extensions":["unityweb"]},
	"application/vnd.uoml+xml": {"source":"iana","extensions":["uoml"]},
	"application/vnd.uplanet.alert": {"source":"iana"},
	"application/vnd.uplanet.alert-wbxml": {"source":"iana"},
	"application/vnd.uplanet.bearer-choice": {"source":"iana"},
	"application/vnd.uplanet.bearer-choice-wbxml": {"source":"iana"},
	"application/vnd.uplanet.cacheop": {"source":"iana"},
	"application/vnd.uplanet.cacheop-wbxml": {"source":"iana"},
	"application/vnd.uplanet.channel": {"source":"iana"},
	"application/vnd.uplanet.channel-wbxml": {"source":"iana"},
	"application/vnd.uplanet.list": {"source":"iana"},
	"application/vnd.uplanet.list-wbxml": {"source":"iana"},
	"application/vnd.uplanet.listcmd": {"source":"iana"},
	"application/vnd.uplanet.listcmd-wbxml": {"source":"iana"},
	"application/vnd.uplanet.signal": {"source":"iana"},
	"application/vnd.uri-map": {"source":"iana"},
	"application/vnd.valve.source.material": {"source":"iana"},
	"application/vnd.vcx": {"source":"iana","extensions":["vcx"]},
	"application/vnd.vd-study": {"source":"iana"},
	"application/vnd.vectorworks": {"source":"iana"},
	"application/vnd.vel+json": {"source":"iana","compressible":true},
	"application/vnd.verimatrix.vcas": {"source":"iana"},
	"application/vnd.vidsoft.vidconference": {"source":"iana"},
	"application/vnd.visio": {"source":"iana","extensions":["vsd","vst","vss","vsw"]},
	"application/vnd.visionary": {"source":"iana","extensions":["vis"]},
	"application/vnd.vividence.scriptfile": {"source":"iana"},
	"application/vnd.vsf": {"source":"iana","extensions":["vsf"]},
	"application/vnd.wap.sic": {"source":"iana"},
	"application/vnd.wap.slc": {"source":"iana"},
	"application/vnd.wap.wbxml": {"source":"iana","extensions":["wbxml"]},
	"application/vnd.wap.wmlc": {"source":"iana","extensions":["wmlc"]},
	"application/vnd.wap.wmlscriptc": {"source":"iana","extensions":["wmlsc"]},
	"application/vnd.webturbo": {"source":"iana","extensions":["wtb"]},
	"application/vnd.wfa.p2p": {"source":"iana"},
	"application/vnd.wfa.wsc": {"source":"iana"},
	"application/vnd.windows.devicepairing": {"source":"iana"},
	"application/vnd.wmc": {"source":"iana"},
	"application/vnd.wmf.bootstrap": {"source":"iana"},
	"application/vnd.wolfram.mathematica": {"source":"iana"},
	"application/vnd.wolfram.mathematica.package": {"source":"iana"},
	"application/vnd.wolfram.player": {"source":"iana","extensions":["nbp"]},
	"application/vnd.wordperfect": {"source":"iana","extensions":["wpd"]},
	"application/vnd.wqd": {"source":"iana","extensions":["wqd"]},
	"application/vnd.wrq-hp3000-labelled": {"source":"iana"},
	"application/vnd.wt.stf": {"source":"iana","extensions":["stf"]},
	"application/vnd.wv.csp+wbxml": {"source":"iana"},
	"application/vnd.wv.csp+xml": {"source":"iana"},
	"application/vnd.wv.ssp+xml": {"source":"iana"},
	"application/vnd.xacml+json": {"source":"iana","compressible":true},
	"application/vnd.xara": {"source":"iana","extensions":["xar"]},
	"application/vnd.xfdl": {"source":"iana","extensions":["xfdl"]},
	"application/vnd.xfdl.webform": {"source":"iana"},
	"application/vnd.xmi+xml": {"source":"iana"},
	"application/vnd.xmpie.cpkg": {"source":"iana"},
	"application/vnd.xmpie.dpkg": {"source":"iana"},
	"application/vnd.xmpie.plan": {"source":"iana"},
	"application/vnd.xmpie.ppkg": {"source":"iana"},
	"application/vnd.xmpie.xlim": {"source":"iana"},
	"application/vnd.yamaha.hv-dic": {"source":"iana","extensions":["hvd"]},
	"application/vnd.yamaha.hv-script": {"source":"iana","extensions":["hvs"]},
	"application/vnd.yamaha.hv-voice": {"source":"iana","extensions":["hvp"]},
	"application/vnd.yamaha.openscoreformat": {"source":"iana","extensions":["osf"]},
	"application/vnd.yamaha.openscoreformat.osfpvg+xml": {"source":"iana","extensions":["osfpvg"]},
	"application/vnd.yamaha.remote-setup": {"source":"iana"},
	"application/vnd.yamaha.smaf-audio": {"source":"iana","extensions":["saf"]},
	"application/vnd.yamaha.smaf-phrase": {"source":"iana","extensions":["spf"]},
	"application/vnd.yamaha.through-ngn": {"source":"iana"},
	"application/vnd.yamaha.tunnel-udpencap": {"source":"iana"},
	"application/vnd.yaoweme": {"source":"iana"},
	"application/vnd.yellowriver-custom-menu": {"source":"iana","extensions":["cmp"]},
	"application/vnd.youtube.yt": {"source":"iana"},
	"application/vnd.zul": {"source":"iana","extensions":["zir","zirz"]},
	"application/vnd.zzazz.deck+xml": {"source":"iana","extensions":["zaz"]},
	"application/voicexml+xml": {"source":"iana","extensions":["vxml"]},
	"application/voucher-cms+json": {"source":"iana","compressible":true},
	"application/vq-rtcpxr": {"source":"iana"},
	"application/wasm": {"compressible":true,"extensions":["wasm"]},
	"application/watcherinfo+xml": {"source":"iana"},
	"application/webpush-options+json": {"source":"iana","compressible":true},
	"application/whoispp-query": {"source":"iana"},
	"application/whoispp-response": {"source":"iana"},
	"application/widget": {"source":"iana","extensions":["wgt"]},
	"application/winhlp": {"source":"apache","extensions":["hlp"]},
	"application/wita": {"source":"iana"},
	"application/wordperfect5.1": {"source":"iana"},
	"application/wsdl+xml": {"source":"iana","extensions":["wsdl"]},
	"application/wspolicy+xml": {"source":"iana","extensions":["wspolicy"]},
	"application/x-7z-compressed": {"source":"apache","compressible":false,"extensions":["7z"]},
	"application/x-abiword": {"source":"apache","extensions":["abw"]},
	"application/x-ace-compressed": {"source":"apache","extensions":["ace"]},
	"application/x-amf": {"source":"apache"},
	"application/x-apple-diskimage": {"source":"apache","extensions":["dmg"]},
	"application/x-arj": {"compressible":false,"extensions":["arj"]},
	"application/x-authorware-bin": {"source":"apache","extensions":["aab","x32","u32","vox"]},
	"application/x-authorware-map": {"source":"apache","extensions":["aam"]},
	"application/x-authorware-seg": {"source":"apache","extensions":["aas"]},
	"application/x-bcpio": {"source":"apache","extensions":["bcpio"]},
	"application/x-bdoc": {"compressible":false,"extensions":["bdoc"]},
	"application/x-bittorrent": {"source":"apache","extensions":["torrent"]},
	"application/x-blorb": {"source":"apache","extensions":["blb","blorb"]},
	"application/x-bzip": {"source":"apache","compressible":false,"extensions":["bz"]},
	"application/x-bzip2": {"source":"apache","compressible":false,"extensions":["bz2","boz"]},
	"application/x-cbr": {"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},
	"application/x-cdlink": {"source":"apache","extensions":["vcd"]},
	"application/x-cfs-compressed": {"source":"apache","extensions":["cfs"]},
	"application/x-chat": {"source":"apache","extensions":["chat"]},
	"application/x-chess-pgn": {"source":"apache","extensions":["pgn"]},
	"application/x-chrome-extension": {"extensions":["crx"]},
	"application/x-cocoa": {"source":"nginx","extensions":["cco"]},
	"application/x-compress": {"source":"apache"},
	"application/x-conference": {"source":"apache","extensions":["nsc"]},
	"application/x-cpio": {"source":"apache","extensions":["cpio"]},
	"application/x-csh": {"source":"apache","extensions":["csh"]},
	"application/x-deb": {"compressible":false},
	"application/x-debian-package": {"source":"apache","extensions":["deb","udeb"]},
	"application/x-dgc-compressed": {"source":"apache","extensions":["dgc"]},
	"application/x-director": {"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},
	"application/x-doom": {"source":"apache","extensions":["wad"]},
	"application/x-dtbncx+xml": {"source":"apache","extensions":["ncx"]},
	"application/x-dtbook+xml": {"source":"apache","extensions":["dtb"]},
	"application/x-dtbresource+xml": {"source":"apache","extensions":["res"]},
	"application/x-dvi": {"source":"apache","compressible":false,"extensions":["dvi"]},
	"application/x-envoy": {"source":"apache","extensions":["evy"]},
	"application/x-eva": {"source":"apache","extensions":["eva"]},
	"application/x-font-bdf": {"source":"apache","extensions":["bdf"]},
	"application/x-font-dos": {"source":"apache"},
	"application/x-font-framemaker": {"source":"apache"},
	"application/x-font-ghostscript": {"source":"apache","extensions":["gsf"]},
	"application/x-font-libgrx": {"source":"apache"},
	"application/x-font-linux-psf": {"source":"apache","extensions":["psf"]},
	"application/x-font-pcf": {"source":"apache","extensions":["pcf"]},
	"application/x-font-snf": {"source":"apache","extensions":["snf"]},
	"application/x-font-speedo": {"source":"apache"},
	"application/x-font-sunos-news": {"source":"apache"},
	"application/x-font-type1": {"source":"apache","extensions":["pfa","pfb","pfm","afm"]},
	"application/x-font-vfont": {"source":"apache"},
	"application/x-freearc": {"source":"apache","extensions":["arc"]},
	"application/x-futuresplash": {"source":"apache","extensions":["spl"]},
	"application/x-gca-compressed": {"source":"apache","extensions":["gca"]},
	"application/x-glulx": {"source":"apache","extensions":["ulx"]},
	"application/x-gnumeric": {"source":"apache","extensions":["gnumeric"]},
	"application/x-gramps-xml": {"source":"apache","extensions":["gramps"]},
	"application/x-gtar": {"source":"apache","extensions":["gtar"]},
	"application/x-gzip": {"source":"apache"},
	"application/x-hdf": {"source":"apache","extensions":["hdf"]},
	"application/x-httpd-php": {"compressible":true,"extensions":["php"]},
	"application/x-install-instructions": {"source":"apache","extensions":["install"]},
	"application/x-iso9660-image": {"source":"apache","extensions":["iso"]},
	"application/x-java-archive-diff": {"source":"nginx","extensions":["jardiff"]},
	"application/x-java-jnlp-file": {"source":"apache","compressible":false,"extensions":["jnlp"]},
	"application/x-javascript": {"compressible":true},
	"application/x-latex": {"source":"apache","compressible":false,"extensions":["latex"]},
	"application/x-lua-bytecode": {"extensions":["luac"]},
	"application/x-lzh-compressed": {"source":"apache","extensions":["lzh","lha"]},
	"application/x-makeself": {"source":"nginx","extensions":["run"]},
	"application/x-mie": {"source":"apache","extensions":["mie"]},
	"application/x-mobipocket-ebook": {"source":"apache","extensions":["prc","mobi"]},
	"application/x-mpegurl": {"compressible":false},
	"application/x-ms-application": {"source":"apache","extensions":["application"]},
	"application/x-ms-shortcut": {"source":"apache","extensions":["lnk"]},
	"application/x-ms-wmd": {"source":"apache","extensions":["wmd"]},
	"application/x-ms-wmz": {"source":"apache","extensions":["wmz"]},
	"application/x-ms-xbap": {"source":"apache","extensions":["xbap"]},
	"application/x-msaccess": {"source":"apache","extensions":["mdb"]},
	"application/x-msbinder": {"source":"apache","extensions":["obd"]},
	"application/x-mscardfile": {"source":"apache","extensions":["crd"]},
	"application/x-msclip": {"source":"apache","extensions":["clp"]},
	"application/x-msdos-program": {"extensions":["exe"]},
	"application/x-msdownload": {"source":"apache","extensions":["exe","dll","com","bat","msi"]},
	"application/x-msmediaview": {"source":"apache","extensions":["mvb","m13","m14"]},
	"application/x-msmetafile": {"source":"apache","extensions":["wmf","wmz","emf","emz"]},
	"application/x-msmoney": {"source":"apache","extensions":["mny"]},
	"application/x-mspublisher": {"source":"apache","extensions":["pub"]},
	"application/x-msschedule": {"source":"apache","extensions":["scd"]},
	"application/x-msterminal": {"source":"apache","extensions":["trm"]},
	"application/x-mswrite": {"source":"apache","extensions":["wri"]},
	"application/x-netcdf": {"source":"apache","extensions":["nc","cdf"]},
	"application/x-ns-proxy-autoconfig": {"compressible":true,"extensions":["pac"]},
	"application/x-nzb": {"source":"apache","extensions":["nzb"]},
	"application/x-perl": {"source":"nginx","extensions":["pl","pm"]},
	"application/x-pilot": {"source":"nginx","extensions":["prc","pdb"]},
	"application/x-pkcs12": {"source":"apache","compressible":false,"extensions":["p12","pfx"]},
	"application/x-pkcs7-certificates": {"source":"apache","extensions":["p7b","spc"]},
	"application/x-pkcs7-certreqresp": {"source":"apache","extensions":["p7r"]},
	"application/x-rar-compressed": {"source":"apache","compressible":false,"extensions":["rar"]},
	"application/x-redhat-package-manager": {"source":"nginx","extensions":["rpm"]},
	"application/x-research-info-systems": {"source":"apache","extensions":["ris"]},
	"application/x-sea": {"source":"nginx","extensions":["sea"]},
	"application/x-sh": {"source":"apache","compressible":true,"extensions":["sh"]},
	"application/x-shar": {"source":"apache","extensions":["shar"]},
	"application/x-shockwave-flash": {"source":"apache","compressible":false,"extensions":["swf"]},
	"application/x-silverlight-app": {"source":"apache","extensions":["xap"]},
	"application/x-sql": {"source":"apache","extensions":["sql"]},
	"application/x-stuffit": {"source":"apache","compressible":false,"extensions":["sit"]},
	"application/x-stuffitx": {"source":"apache","extensions":["sitx"]},
	"application/x-subrip": {"source":"apache","extensions":["srt"]},
	"application/x-sv4cpio": {"source":"apache","extensions":["sv4cpio"]},
	"application/x-sv4crc": {"source":"apache","extensions":["sv4crc"]},
	"application/x-t3vm-image": {"source":"apache","extensions":["t3"]},
	"application/x-tads": {"source":"apache","extensions":["gam"]},
	"application/x-tar": {"source":"apache","compressible":true,"extensions":["tar"]},
	"application/x-tcl": {"source":"apache","extensions":["tcl","tk"]},
	"application/x-tex": {"source":"apache","extensions":["tex"]},
	"application/x-tex-tfm": {"source":"apache","extensions":["tfm"]},
	"application/x-texinfo": {"source":"apache","extensions":["texinfo","texi"]},
	"application/x-tgif": {"source":"apache","extensions":["obj"]},
	"application/x-ustar": {"source":"apache","extensions":["ustar"]},
	"application/x-virtualbox-hdd": {"compressible":true,"extensions":["hdd"]},
	"application/x-virtualbox-ova": {"compressible":true,"extensions":["ova"]},
	"application/x-virtualbox-ovf": {"compressible":true,"extensions":["ovf"]},
	"application/x-virtualbox-vbox": {"compressible":true,"extensions":["vbox"]},
	"application/x-virtualbox-vbox-extpack": {"compressible":false,"extensions":["vbox-extpack"]},
	"application/x-virtualbox-vdi": {"compressible":true,"extensions":["vdi"]},
	"application/x-virtualbox-vhd": {"compressible":true,"extensions":["vhd"]},
	"application/x-virtualbox-vmdk": {"compressible":true,"extensions":["vmdk"]},
	"application/x-wais-source": {"source":"apache","extensions":["src"]},
	"application/x-web-app-manifest+json": {"compressible":true,"extensions":["webapp"]},
	"application/x-www-form-urlencoded": {"source":"iana","compressible":true},
	"application/x-x509-ca-cert": {"source":"apache","extensions":["der","crt","pem"]},
	"application/x-xfig": {"source":"apache","extensions":["fig"]},
	"application/x-xliff+xml": {"source":"apache","extensions":["xlf"]},
	"application/x-xpinstall": {"source":"apache","compressible":false,"extensions":["xpi"]},
	"application/x-xz": {"source":"apache","extensions":["xz"]},
	"application/x-zmachine": {"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},
	"application/x400-bp": {"source":"iana"},
	"application/xacml+xml": {"source":"iana"},
	"application/xaml+xml": {"source":"apache","extensions":["xaml"]},
	"application/xcap-att+xml": {"source":"iana"},
	"application/xcap-caps+xml": {"source":"iana"},
	"application/xcap-diff+xml": {"source":"iana","extensions":["xdf"]},
	"application/xcap-el+xml": {"source":"iana"},
	"application/xcap-error+xml": {"source":"iana"},
	"application/xcap-ns+xml": {"source":"iana"},
	"application/xcon-conference-info+xml": {"source":"iana"},
	"application/xcon-conference-info-diff+xml": {"source":"iana"},
	"application/xenc+xml": {"source":"iana","extensions":["xenc"]},
	"application/xhtml+xml": {"source":"iana","compressible":true,"extensions":["xhtml","xht"]},
	"application/xhtml-voice+xml": {"source":"apache"},
	"application/xml": {"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},
	"application/xml-dtd": {"source":"iana","compressible":true,"extensions":["dtd"]},
	"application/xml-external-parsed-entity": {"source":"iana"},
	"application/xml-patch+xml": {"source":"iana"},
	"application/xmpp+xml": {"source":"iana"},
	"application/xop+xml": {"source":"iana","compressible":true,"extensions":["xop"]},
	"application/xproc+xml": {"source":"apache","extensions":["xpl"]},
	"application/xslt+xml": {"source":"iana","extensions":["xslt"]},
	"application/xspf+xml": {"source":"apache","extensions":["xspf"]},
	"application/xv+xml": {"source":"iana","extensions":["mxml","xhvml","xvml","xvm"]},
	"application/yang": {"source":"iana","extensions":["yang"]},
	"application/yang-data+json": {"source":"iana","compressible":true},
	"application/yang-data+xml": {"source":"iana"},
	"application/yang-patch+json": {"source":"iana","compressible":true},
	"application/yang-patch+xml": {"source":"iana"},
	"application/yin+xml": {"source":"iana","extensions":["yin"]},
	"application/zip": {"source":"iana","compressible":false,"extensions":["zip"]},
	"application/zlib": {"source":"iana"},
	"audio/1d-interleaved-parityfec": {"source":"iana"},
	"audio/32kadpcm": {"source":"iana"},
	"audio/3gpp": {"source":"iana","compressible":false,"extensions":["3gpp"]},
	"audio/3gpp2": {"source":"iana"},
	"audio/ac3": {"source":"iana"},
	"audio/adpcm": {"source":"apache","extensions":["adp"]},
	"audio/amr": {"source":"iana"},
	"audio/amr-wb": {"source":"iana"},
	"audio/amr-wb+": {"source":"iana"},
	"audio/aptx": {"source":"iana"},
	"audio/asc": {"source":"iana"},
	"audio/atrac-advanced-lossless": {"source":"iana"},
	"audio/atrac-x": {"source":"iana"},
	"audio/atrac3": {"source":"iana"},
	"audio/basic": {"source":"iana","compressible":false,"extensions":["au","snd"]},
	"audio/bv16": {"source":"iana"},
	"audio/bv32": {"source":"iana"},
	"audio/clearmode": {"source":"iana"},
	"audio/cn": {"source":"iana"},
	"audio/dat12": {"source":"iana"},
	"audio/dls": {"source":"iana"},
	"audio/dsr-es201108": {"source":"iana"},
	"audio/dsr-es202050": {"source":"iana"},
	"audio/dsr-es202211": {"source":"iana"},
	"audio/dsr-es202212": {"source":"iana"},
	"audio/dv": {"source":"iana"},
	"audio/dvi4": {"source":"iana"},
	"audio/eac3": {"source":"iana"},
	"audio/encaprtp": {"source":"iana"},
	"audio/evrc": {"source":"iana"},
	"audio/evrc-qcp": {"source":"iana"},
	"audio/evrc0": {"source":"iana"},
	"audio/evrc1": {"source":"iana"},
	"audio/evrcb": {"source":"iana"},
	"audio/evrcb0": {"source":"iana"},
	"audio/evrcb1": {"source":"iana"},
	"audio/evrcnw": {"source":"iana"},
	"audio/evrcnw0": {"source":"iana"},
	"audio/evrcnw1": {"source":"iana"},
	"audio/evrcwb": {"source":"iana"},
	"audio/evrcwb0": {"source":"iana"},
	"audio/evrcwb1": {"source":"iana"},
	"audio/evs": {"source":"iana"},
	"audio/fwdred": {"source":"iana"},
	"audio/g711-0": {"source":"iana"},
	"audio/g719": {"source":"iana"},
	"audio/g722": {"source":"iana"},
	"audio/g7221": {"source":"iana"},
	"audio/g723": {"source":"iana"},
	"audio/g726-16": {"source":"iana"},
	"audio/g726-24": {"source":"iana"},
	"audio/g726-32": {"source":"iana"},
	"audio/g726-40": {"source":"iana"},
	"audio/g728": {"source":"iana"},
	"audio/g729": {"source":"iana"},
	"audio/g7291": {"source":"iana"},
	"audio/g729d": {"source":"iana"},
	"audio/g729e": {"source":"iana"},
	"audio/gsm": {"source":"iana"},
	"audio/gsm-efr": {"source":"iana"},
	"audio/gsm-hr-08": {"source":"iana"},
	"audio/ilbc": {"source":"iana"},
	"audio/ip-mr_v2.5": {"source":"iana"},
	"audio/isac": {"source":"apache"},
	"audio/l16": {"source":"iana"},
	"audio/l20": {"source":"iana"},
	"audio/l24": {"source":"iana","compressible":false},
	"audio/l8": {"source":"iana"},
	"audio/lpc": {"source":"iana"},
	"audio/melp": {"source":"iana"},
	"audio/melp1200": {"source":"iana"},
	"audio/melp2400": {"source":"iana"},
	"audio/melp600": {"source":"iana"},
	"audio/midi": {"source":"apache","extensions":["mid","midi","kar","rmi"]},
	"audio/mobile-xmf": {"source":"iana"},
	"audio/mp3": {"compressible":false,"extensions":["mp3"]},
	"audio/mp4": {"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},
	"audio/mp4a-latm": {"source":"iana"},
	"audio/mpa": {"source":"iana"},
	"audio/mpa-robust": {"source":"iana"},
	"audio/mpeg": {"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},
	"audio/mpeg4-generic": {"source":"iana"},
	"audio/musepack": {"source":"apache"},
	"audio/ogg": {"source":"iana","compressible":false,"extensions":["oga","ogg","spx"]},
	"audio/opus": {"source":"iana"},
	"audio/parityfec": {"source":"iana"},
	"audio/pcma": {"source":"iana"},
	"audio/pcma-wb": {"source":"iana"},
	"audio/pcmu": {"source":"iana"},
	"audio/pcmu-wb": {"source":"iana"},
	"audio/prs.sid": {"source":"iana"},
	"audio/qcelp": {"source":"iana"},
	"audio/raptorfec": {"source":"iana"},
	"audio/red": {"source":"iana"},
	"audio/rtp-enc-aescm128": {"source":"iana"},
	"audio/rtp-midi": {"source":"iana"},
	"audio/rtploopback": {"source":"iana"},
	"audio/rtx": {"source":"iana"},
	"audio/s3m": {"source":"apache","extensions":["s3m"]},
	"audio/silk": {"source":"apache","extensions":["sil"]},
	"audio/smv": {"source":"iana"},
	"audio/smv-qcp": {"source":"iana"},
	"audio/smv0": {"source":"iana"},
	"audio/sp-midi": {"source":"iana"},
	"audio/speex": {"source":"iana"},
	"audio/t140c": {"source":"iana"},
	"audio/t38": {"source":"iana"},
	"audio/telephone-event": {"source":"iana"},
	"audio/tone": {"source":"iana"},
	"audio/uemclip": {"source":"iana"},
	"audio/ulpfec": {"source":"iana"},
	"audio/vdvi": {"source":"iana"},
	"audio/vmr-wb": {"source":"iana"},
	"audio/vnd.3gpp.iufp": {"source":"iana"},
	"audio/vnd.4sb": {"source":"iana"},
	"audio/vnd.audiokoz": {"source":"iana"},
	"audio/vnd.celp": {"source":"iana"},
	"audio/vnd.cisco.nse": {"source":"iana"},
	"audio/vnd.cmles.radio-events": {"source":"iana"},
	"audio/vnd.cns.anp1": {"source":"iana"},
	"audio/vnd.cns.inf1": {"source":"iana"},
	"audio/vnd.dece.audio": {"source":"iana","extensions":["uva","uvva"]},
	"audio/vnd.digital-winds": {"source":"iana","extensions":["eol"]},
	"audio/vnd.dlna.adts": {"source":"iana"},
	"audio/vnd.dolby.heaac.1": {"source":"iana"},
	"audio/vnd.dolby.heaac.2": {"source":"iana"},
	"audio/vnd.dolby.mlp": {"source":"iana"},
	"audio/vnd.dolby.mps": {"source":"iana"},
	"audio/vnd.dolby.pl2": {"source":"iana"},
	"audio/vnd.dolby.pl2x": {"source":"iana"},
	"audio/vnd.dolby.pl2z": {"source":"iana"},
	"audio/vnd.dolby.pulse.1": {"source":"iana"},
	"audio/vnd.dra": {"source":"iana","extensions":["dra"]},
	"audio/vnd.dts": {"source":"iana","extensions":["dts"]},
	"audio/vnd.dts.hd": {"source":"iana","extensions":["dtshd"]},
	"audio/vnd.dvb.file": {"source":"iana"},
	"audio/vnd.everad.plj": {"source":"iana"},
	"audio/vnd.hns.audio": {"source":"iana"},
	"audio/vnd.lucent.voice": {"source":"iana","extensions":["lvp"]},
	"audio/vnd.ms-playready.media.pya": {"source":"iana","extensions":["pya"]},
	"audio/vnd.nokia.mobile-xmf": {"source":"iana"},
	"audio/vnd.nortel.vbk": {"source":"iana"},
	"audio/vnd.nuera.ecelp4800": {"source":"iana","extensions":["ecelp4800"]},
	"audio/vnd.nuera.ecelp7470": {"source":"iana","extensions":["ecelp7470"]},
	"audio/vnd.nuera.ecelp9600": {"source":"iana","extensions":["ecelp9600"]},
	"audio/vnd.octel.sbc": {"source":"iana"},
	"audio/vnd.presonus.multitrack": {"source":"iana"},
	"audio/vnd.qcelp": {"source":"iana"},
	"audio/vnd.rhetorex.32kadpcm": {"source":"iana"},
	"audio/vnd.rip": {"source":"iana","extensions":["rip"]},
	"audio/vnd.rn-realaudio": {"compressible":false},
	"audio/vnd.sealedmedia.softseal.mpeg": {"source":"iana"},
	"audio/vnd.vmx.cvsd": {"source":"iana"},
	"audio/vnd.wave": {"compressible":false},
	"audio/vorbis": {"source":"iana","compressible":false},
	"audio/vorbis-config": {"source":"iana"},
	"audio/wav": {"compressible":false,"extensions":["wav"]},
	"audio/wave": {"compressible":false,"extensions":["wav"]},
	"audio/webm": {"source":"apache","compressible":false,"extensions":["weba"]},
	"audio/x-aac": {"source":"apache","compressible":false,"extensions":["aac"]},
	"audio/x-aiff": {"source":"apache","extensions":["aif","aiff","aifc"]},
	"audio/x-caf": {"source":"apache","compressible":false,"extensions":["caf"]},
	"audio/x-flac": {"source":"apache","extensions":["flac"]},
	"audio/x-m4a": {"source":"nginx","extensions":["m4a"]},
	"audio/x-matroska": {"source":"apache","extensions":["mka"]},
	"audio/x-mpegurl": {"source":"apache","extensions":["m3u"]},
	"audio/x-ms-wax": {"source":"apache","extensions":["wax"]},
	"audio/x-ms-wma": {"source":"apache","extensions":["wma"]},
	"audio/x-pn-realaudio": {"source":"apache","extensions":["ram","ra"]},
	"audio/x-pn-realaudio-plugin": {"source":"apache","extensions":["rmp"]},
	"audio/x-realaudio": {"source":"nginx","extensions":["ra"]},
	"audio/x-tta": {"source":"apache"},
	"audio/x-wav": {"source":"apache","extensions":["wav"]},
	"audio/xm": {"source":"apache","extensions":["xm"]},
	"chemical/x-cdx": {"source":"apache","extensions":["cdx"]},
	"chemical/x-cif": {"source":"apache","extensions":["cif"]},
	"chemical/x-cmdf": {"source":"apache","extensions":["cmdf"]},
	"chemical/x-cml": {"source":"apache","extensions":["cml"]},
	"chemical/x-csml": {"source":"apache","extensions":["csml"]},
	"chemical/x-pdb": {"source":"apache"},
	"chemical/x-xyz": {"source":"apache","extensions":["xyz"]},
	"font/collection": {"source":"iana","extensions":["ttc"]},
	"font/otf": {"source":"iana","compressible":true,"extensions":["otf"]},
	"font/sfnt": {"source":"iana"},
	"font/ttf": {"source":"iana","extensions":["ttf"]},
	"font/woff": {"source":"iana","extensions":["woff"]},
	"font/woff2": {"source":"iana","extensions":["woff2"]},
	"image/aces": {"source":"iana"},
	"image/apng": {"compressible":false,"extensions":["apng"]},
	"image/bmp": {"source":"iana","compressible":true,"extensions":["bmp"]},
	"image/cgm": {"source":"iana","extensions":["cgm"]},
	"image/dicom-rle": {"source":"iana"},
	"image/emf": {"source":"iana"},
	"image/fits": {"source":"iana"},
	"image/g3fax": {"source":"iana","extensions":["g3"]},
	"image/gif": {"source":"iana","compressible":false,"extensions":["gif"]},
	"image/ief": {"source":"iana","extensions":["ief"]},
	"image/jls": {"source":"iana"},
	"image/jp2": {"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},
	"image/jpeg": {"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},
	"image/jpm": {"source":"iana","compressible":false,"extensions":["jpm"]},
	"image/jpx": {"source":"iana","compressible":false,"extensions":["jpx","jpf"]},
	"image/ktx": {"source":"iana","extensions":["ktx"]},
	"image/naplps": {"source":"iana"},
	"image/pjpeg": {"compressible":false},
	"image/png": {"source":"iana","compressible":false,"extensions":["png"]},
	"image/prs.btif": {"source":"iana","extensions":["btif"]},
	"image/prs.pti": {"source":"iana"},
	"image/pwg-raster": {"source":"iana"},
	"image/sgi": {"source":"apache","extensions":["sgi"]},
	"image/svg+xml": {"source":"iana","compressible":true,"extensions":["svg","svgz"]},
	"image/t38": {"source":"iana"},
	"image/tiff": {"source":"iana","compressible":false,"extensions":["tiff","tif"]},
	"image/tiff-fx": {"source":"iana"},
	"image/vnd.adobe.photoshop": {"source":"iana","compressible":true,"extensions":["psd"]},
	"image/vnd.airzip.accelerator.azv": {"source":"iana"},
	"image/vnd.cns.inf2": {"source":"iana"},
	"image/vnd.dece.graphic": {"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},
	"image/vnd.djvu": {"source":"iana","extensions":["djvu","djv"]},
	"image/vnd.dvb.subtitle": {"source":"iana","extensions":["sub"]},
	"image/vnd.dwg": {"source":"iana","extensions":["dwg"]},
	"image/vnd.dxf": {"source":"iana","extensions":["dxf"]},
	"image/vnd.fastbidsheet": {"source":"iana","extensions":["fbs"]},
	"image/vnd.fpx": {"source":"iana","extensions":["fpx"]},
	"image/vnd.fst": {"source":"iana","extensions":["fst"]},
	"image/vnd.fujixerox.edmics-mmr": {"source":"iana","extensions":["mmr"]},
	"image/vnd.fujixerox.edmics-rlc": {"source":"iana","extensions":["rlc"]},
	"image/vnd.globalgraphics.pgb": {"source":"iana"},
	"image/vnd.microsoft.icon": {"source":"iana"},
	"image/vnd.mix": {"source":"iana"},
	"image/vnd.mozilla.apng": {"source":"iana"},
	"image/vnd.ms-modi": {"source":"iana","extensions":["mdi"]},
	"image/vnd.ms-photo": {"source":"apache","extensions":["wdp"]},
	"image/vnd.net-fpx": {"source":"iana","extensions":["npx"]},
	"image/vnd.radiance": {"source":"iana"},
	"image/vnd.sealed.png": {"source":"iana"},
	"image/vnd.sealedmedia.softseal.gif": {"source":"iana"},
	"image/vnd.sealedmedia.softseal.jpg": {"source":"iana"},
	"image/vnd.svf": {"source":"iana"},
	"image/vnd.tencent.tap": {"source":"iana"},
	"image/vnd.valve.source.texture": {"source":"iana"},
	"image/vnd.wap.wbmp": {"source":"iana","extensions":["wbmp"]},
	"image/vnd.xiff": {"source":"iana","extensions":["xif"]},
	"image/vnd.zbrush.pcx": {"source":"iana"},
	"image/webp": {"source":"apache","extensions":["webp"]},
	"image/wmf": {"source":"iana"},
	"image/x-3ds": {"source":"apache","extensions":["3ds"]},
	"image/x-cmu-raster": {"source":"apache","extensions":["ras"]},
	"image/x-cmx": {"source":"apache","extensions":["cmx"]},
	"image/x-freehand": {"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},
	"image/x-icon": {"source":"apache","compressible":true,"extensions":["ico"]},
	"image/x-jng": {"source":"nginx","extensions":["jng"]},
	"image/x-mrsid-image": {"source":"apache","extensions":["sid"]},
	"image/x-ms-bmp": {"source":"nginx","compressible":true,"extensions":["bmp"]},
	"image/x-pcx": {"source":"apache","extensions":["pcx"]},
	"image/x-pict": {"source":"apache","extensions":["pic","pct"]},
	"image/x-portable-anymap": {"source":"apache","extensions":["pnm"]},
	"image/x-portable-bitmap": {"source":"apache","extensions":["pbm"]},
	"image/x-portable-graymap": {"source":"apache","extensions":["pgm"]},
	"image/x-portable-pixmap": {"source":"apache","extensions":["ppm"]},
	"image/x-rgb": {"source":"apache","extensions":["rgb"]},
	"image/x-tga": {"source":"apache","extensions":["tga"]},
	"image/x-xbitmap": {"source":"apache","extensions":["xbm"]},
	"image/x-xcf": {"compressible":false},
	"image/x-xpixmap": {"source":"apache","extensions":["xpm"]},
	"image/x-xwindowdump": {"source":"apache","extensions":["xwd"]},
	"message/cpim": {"source":"iana"},
	"message/delivery-status": {"source":"iana"},
	"message/disposition-notification": {"source":"iana","extensions":["disposition-notification"]},
	"message/external-body": {"source":"iana"},
	"message/feedback-report": {"source":"iana"},
	"message/global": {"source":"iana","extensions":["u8msg"]},
	"message/global-delivery-status": {"source":"iana","extensions":["u8dsn"]},
	"message/global-disposition-notification": {"source":"iana","extensions":["u8mdn"]},
	"message/global-headers": {"source":"iana","extensions":["u8hdr"]},
	"message/http": {"source":"iana","compressible":false},
	"message/imdn+xml": {"source":"iana","compressible":true},
	"message/news": {"source":"iana"},
	"message/partial": {"source":"iana","compressible":false},
	"message/rfc822": {"source":"iana","compressible":true,"extensions":["eml","mime"]},
	"message/s-http": {"source":"iana"},
	"message/sip": {"source":"iana"},
	"message/sipfrag": {"source":"iana"},
	"message/tracking-status": {"source":"iana"},
	"message/vnd.si.simp": {"source":"iana"},
	"message/vnd.wfa.wsc": {"source":"iana","extensions":["wsc"]},
	"model/3mf": {"source":"iana"},
	"model/gltf+json": {"source":"iana","compressible":true,"extensions":["gltf"]},
	"model/gltf-binary": {"source":"iana","compressible":true,"extensions":["glb"]},
	"model/iges": {"source":"iana","compressible":false,"extensions":["igs","iges"]},
	"model/mesh": {"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},
	"model/vnd.collada+xml": {"source":"iana","extensions":["dae"]},
	"model/vnd.dwf": {"source":"iana","extensions":["dwf"]},
	"model/vnd.flatland.3dml": {"source":"iana"},
	"model/vnd.gdl": {"source":"iana","extensions":["gdl"]},
	"model/vnd.gs-gdl": {"source":"apache"},
	"model/vnd.gs.gdl": {"source":"iana"},
	"model/vnd.gtw": {"source":"iana","extensions":["gtw"]},
	"model/vnd.moml+xml": {"source":"iana"},
	"model/vnd.mts": {"source":"iana","extensions":["mts"]},
	"model/vnd.opengex": {"source":"iana"},
	"model/vnd.parasolid.transmit.binary": {"source":"iana"},
	"model/vnd.parasolid.transmit.text": {"source":"iana"},
	"model/vnd.rosette.annotated-data-model": {"source":"iana"},
	"model/vnd.valve.source.compiled-map": {"source":"iana"},
	"model/vnd.vtu": {"source":"iana","extensions":["vtu"]},
	"model/vrml": {"source":"iana","compressible":false,"extensions":["wrl","vrml"]},
	"model/x3d+binary": {"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},
	"model/x3d+fastinfoset": {"source":"iana"},
	"model/x3d+vrml": {"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},
	"model/x3d+xml": {"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},
	"model/x3d-vrml": {"source":"iana"},
	"multipart/alternative": {"source":"iana","compressible":false},
	"multipart/appledouble": {"source":"iana"},
	"multipart/byteranges": {"source":"iana"},
	"multipart/digest": {"source":"iana"},
	"multipart/encrypted": {"source":"iana","compressible":false},
	"multipart/form-data": {"source":"iana","compressible":false},
	"multipart/header-set": {"source":"iana"},
	"multipart/mixed": {"source":"iana","compressible":false},
	"multipart/multilingual": {"source":"iana"},
	"multipart/parallel": {"source":"iana"},
	"multipart/related": {"source":"iana","compressible":false},
	"multipart/report": {"source":"iana"},
	"multipart/signed": {"source":"iana","compressible":false},
	"multipart/vnd.bint.med-plus": {"source":"iana"},
	"multipart/voice-message": {"source":"iana"},
	"multipart/x-mixed-replace": {"source":"iana"},
	"text/1d-interleaved-parityfec": {"source":"iana"},
	"text/cache-manifest": {"source":"iana","compressible":true,"extensions":["appcache","manifest"]},
	"text/calendar": {"source":"iana","extensions":["ics","ifb"]},
	"text/calender": {"compressible":true},
	"text/cmd": {"compressible":true},
	"text/coffeescript": {"extensions":["coffee","litcoffee"]},
	"text/css": {"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},
	"text/csv": {"source":"iana","compressible":true,"extensions":["csv"]},
	"text/csv-schema": {"source":"iana"},
	"text/directory": {"source":"iana"},
	"text/dns": {"source":"iana"},
	"text/ecmascript": {"source":"iana"},
	"text/encaprtp": {"source":"iana"},
	"text/enriched": {"source":"iana"},
	"text/fwdred": {"source":"iana"},
	"text/grammar-ref-list": {"source":"iana"},
	"text/html": {"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},
	"text/jade": {"extensions":["jade"]},
	"text/javascript": {"source":"iana","compressible":true},
	"text/jcr-cnd": {"source":"iana"},
	"text/jsx": {"compressible":true,"extensions":["jsx"]},
	"text/less": {"extensions":["less"]},
	"text/markdown": {"source":"iana","compressible":true,"extensions":["markdown","md"]},
	"text/mathml": {"source":"nginx","extensions":["mml"]},
	"text/mizar": {"source":"iana"},
	"text/n3": {"source":"iana","compressible":true,"extensions":["n3"]},
	"text/parameters": {"source":"iana"},
	"text/parityfec": {"source":"iana"},
	"text/plain": {"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},
	"text/provenance-notation": {"source":"iana"},
	"text/prs.fallenstein.rst": {"source":"iana"},
	"text/prs.lines.tag": {"source":"iana","extensions":["dsc"]},
	"text/prs.prop.logic": {"source":"iana"},
	"text/raptorfec": {"source":"iana"},
	"text/red": {"source":"iana"},
	"text/rfc822-headers": {"source":"iana"},
	"text/richtext": {"source":"iana","compressible":true,"extensions":["rtx"]},
	"text/rtf": {"source":"iana","compressible":true,"extensions":["rtf"]},
	"text/rtp-enc-aescm128": {"source":"iana"},
	"text/rtploopback": {"source":"iana"},
	"text/rtx": {"source":"iana"},
	"text/sgml": {"source":"iana","extensions":["sgml","sgm"]},
	"text/shex": {"extensions":["shex"]},
	"text/slim": {"extensions":["slim","slm"]},
	"text/strings": {"source":"iana"},
	"text/stylus": {"extensions":["stylus","styl"]},
	"text/t140": {"source":"iana"},
	"text/tab-separated-values": {"source":"iana","compressible":true,"extensions":["tsv"]},
	"text/troff": {"source":"iana","extensions":["t","tr","roff","man","me","ms"]},
	"text/turtle": {"source":"iana","extensions":["ttl"]},
	"text/ulpfec": {"source":"iana"},
	"text/uri-list": {"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},
	"text/vcard": {"source":"iana","compressible":true,"extensions":["vcard"]},
	"text/vnd.a": {"source":"iana"},
	"text/vnd.abc": {"source":"iana"},
	"text/vnd.ascii-art": {"source":"iana"},
	"text/vnd.curl": {"source":"iana","extensions":["curl"]},
	"text/vnd.curl.dcurl": {"source":"apache","extensions":["dcurl"]},
	"text/vnd.curl.mcurl": {"source":"apache","extensions":["mcurl"]},
	"text/vnd.curl.scurl": {"source":"apache","extensions":["scurl"]},
	"text/vnd.debian.copyright": {"source":"iana"},
	"text/vnd.dmclientscript": {"source":"iana"},
	"text/vnd.dvb.subtitle": {"source":"iana","extensions":["sub"]},
	"text/vnd.esmertec.theme-descriptor": {"source":"iana"},
	"text/vnd.fly": {"source":"iana","extensions":["fly"]},
	"text/vnd.fmi.flexstor": {"source":"iana","extensions":["flx"]},
	"text/vnd.graphviz": {"source":"iana","extensions":["gv"]},
	"text/vnd.in3d.3dml": {"source":"iana","extensions":["3dml"]},
	"text/vnd.in3d.spot": {"source":"iana","extensions":["spot"]},
	"text/vnd.iptc.newsml": {"source":"iana"},
	"text/vnd.iptc.nitf": {"source":"iana"},
	"text/vnd.latex-z": {"source":"iana"},
	"text/vnd.motorola.reflex": {"source":"iana"},
	"text/vnd.ms-mediapackage": {"source":"iana"},
	"text/vnd.net2phone.commcenter.command": {"source":"iana"},
	"text/vnd.radisys.msml-basic-layout": {"source":"iana"},
	"text/vnd.si.uricatalogue": {"source":"iana"},
	"text/vnd.sun.j2me.app-descriptor": {"source":"iana","extensions":["jad"]},
	"text/vnd.trolltech.linguist": {"source":"iana"},
	"text/vnd.wap.si": {"source":"iana"},
	"text/vnd.wap.sl": {"source":"iana"},
	"text/vnd.wap.wml": {"source":"iana","extensions":["wml"]},
	"text/vnd.wap.wmlscript": {"source":"iana","extensions":["wmls"]},
	"text/vtt": {"charset":"UTF-8","compressible":true,"extensions":["vtt"]},
	"text/x-asm": {"source":"apache","extensions":["s","asm"]},
	"text/x-c": {"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},
	"text/x-component": {"source":"nginx","extensions":["htc"]},
	"text/x-fortran": {"source":"apache","extensions":["f","for","f77","f90"]},
	"text/x-gwt-rpc": {"compressible":true},
	"text/x-handlebars-template": {"extensions":["hbs"]},
	"text/x-java-source": {"source":"apache","extensions":["java"]},
	"text/x-jquery-tmpl": {"compressible":true},
	"text/x-lua": {"extensions":["lua"]},
	"text/x-markdown": {"compressible":true,"extensions":["mkd"]},
	"text/x-nfo": {"source":"apache","extensions":["nfo"]},
	"text/x-opml": {"source":"apache","extensions":["opml"]},
	"text/x-org": {"compressible":true,"extensions":["org"]},
	"text/x-pascal": {"source":"apache","extensions":["p","pas"]},
	"text/x-processing": {"compressible":true,"extensions":["pde"]},
	"text/x-sass": {"extensions":["sass"]},
	"text/x-scss": {"extensions":["scss"]},
	"text/x-setext": {"source":"apache","extensions":["etx"]},
	"text/x-sfv": {"source":"apache","extensions":["sfv"]},
	"text/x-suse-ymp": {"compressible":true,"extensions":["ymp"]},
	"text/x-uuencode": {"source":"apache","extensions":["uu"]},
	"text/x-vcalendar": {"source":"apache","extensions":["vcs"]},
	"text/x-vcard": {"source":"apache","extensions":["vcf"]},
	"text/xml": {"source":"iana","compressible":true,"extensions":["xml"]},
	"text/xml-external-parsed-entity": {"source":"iana"},
	"text/yaml": {"extensions":["yaml","yml"]},
	"video/1d-interleaved-parityfec": {"source":"iana"},
	"video/3gpp": {"source":"iana","extensions":["3gp","3gpp"]},
	"video/3gpp-tt": {"source":"iana"},
	"video/3gpp2": {"source":"iana","extensions":["3g2"]},
	"video/bmpeg": {"source":"iana"},
	"video/bt656": {"source":"iana"},
	"video/celb": {"source":"iana"},
	"video/dv": {"source":"iana"},
	"video/encaprtp": {"source":"iana"},
	"video/h261": {"source":"iana","extensions":["h261"]},
	"video/h263": {"source":"iana","extensions":["h263"]},
	"video/h263-1998": {"source":"iana"},
	"video/h263-2000": {"source":"iana"},
	"video/h264": {"source":"iana","extensions":["h264"]},
	"video/h264-rcdo": {"source":"iana"},
	"video/h264-svc": {"source":"iana"},
	"video/h265": {"source":"iana"},
	"video/iso.segment": {"source":"iana"},
	"video/jpeg": {"source":"iana","extensions":["jpgv"]},
	"video/jpeg2000": {"source":"iana"},
	"video/jpm": {"source":"apache","extensions":["jpm","jpgm"]},
	"video/mj2": {"source":"iana","extensions":["mj2","mjp2"]},
	"video/mp1s": {"source":"iana"},
	"video/mp2p": {"source":"iana"},
	"video/mp2t": {"source":"iana","extensions":["ts"]},
	"video/mp4": {"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},
	"video/mp4v-es": {"source":"iana"},
	"video/mpeg": {"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},
	"video/mpeg4-generic": {"source":"iana"},
	"video/mpv": {"source":"iana"},
	"video/nv": {"source":"iana"},
	"video/ogg": {"source":"iana","compressible":false,"extensions":["ogv"]},
	"video/parityfec": {"source":"iana"},
	"video/pointer": {"source":"iana"},
	"video/quicktime": {"source":"iana","compressible":false,"extensions":["qt","mov"]},
	"video/raptorfec": {"source":"iana"},
	"video/raw": {"source":"iana"},
	"video/rtp-enc-aescm128": {"source":"iana"},
	"video/rtploopback": {"source":"iana"},
	"video/rtx": {"source":"iana"},
	"video/smpte291": {"source":"iana"},
	"video/smpte292m": {"source":"iana"},
	"video/ulpfec": {"source":"iana"},
	"video/vc1": {"source":"iana"},
	"video/vnd.cctv": {"source":"iana"},
	"video/vnd.dece.hd": {"source":"iana","extensions":["uvh","uvvh"]},
	"video/vnd.dece.mobile": {"source":"iana","extensions":["uvm","uvvm"]},
	"video/vnd.dece.mp4": {"source":"iana"},
	"video/vnd.dece.pd": {"source":"iana","extensions":["uvp","uvvp"]},
	"video/vnd.dece.sd": {"source":"iana","extensions":["uvs","uvvs"]},
	"video/vnd.dece.video": {"source":"iana","extensions":["uvv","uvvv"]},
	"video/vnd.directv.mpeg": {"source":"iana"},
	"video/vnd.directv.mpeg-tts": {"source":"iana"},
	"video/vnd.dlna.mpeg-tts": {"source":"iana"},
	"video/vnd.dvb.file": {"source":"iana","extensions":["dvb"]},
	"video/vnd.fvt": {"source":"iana","extensions":["fvt"]},
	"video/vnd.hns.video": {"source":"iana"},
	"video/vnd.iptvforum.1dparityfec-1010": {"source":"iana"},
	"video/vnd.iptvforum.1dparityfec-2005": {"source":"iana"},
	"video/vnd.iptvforum.2dparityfec-1010": {"source":"iana"},
	"video/vnd.iptvforum.2dparityfec-2005": {"source":"iana"},
	"video/vnd.iptvforum.ttsavc": {"source":"iana"},
	"video/vnd.iptvforum.ttsmpeg2": {"source":"iana"},
	"video/vnd.motorola.video": {"source":"iana"},
	"video/vnd.motorola.videop": {"source":"iana"},
	"video/vnd.mpegurl": {"source":"iana","extensions":["mxu","m4u"]},
	"video/vnd.ms-playready.media.pyv": {"source":"iana","extensions":["pyv"]},
	"video/vnd.nokia.interleaved-multimedia": {"source":"iana"},
	"video/vnd.nokia.mp4vr": {"source":"iana"},
	"video/vnd.nokia.videovoip": {"source":"iana"},
	"video/vnd.objectvideo": {"source":"iana"},
	"video/vnd.radgamettools.bink": {"source":"iana"},
	"video/vnd.radgamettools.smacker": {"source":"iana"},
	"video/vnd.sealed.mpeg1": {"source":"iana"},
	"video/vnd.sealed.mpeg4": {"source":"iana"},
	"video/vnd.sealed.swf": {"source":"iana"},
	"video/vnd.sealedmedia.softseal.mov": {"source":"iana"},
	"video/vnd.uvvu.mp4": {"source":"iana","extensions":["uvu","uvvu"]},
	"video/vnd.vivo": {"source":"iana","extensions":["viv"]},
	"video/vp8": {"source":"iana"},
	"video/webm": {"source":"apache","compressible":false,"extensions":["webm"]},
	"video/x-f4v": {"source":"apache","extensions":["f4v"]},
	"video/x-fli": {"source":"apache","extensions":["fli"]},
	"video/x-flv": {"source":"apache","compressible":false,"extensions":["flv"]},
	"video/x-m4v": {"source":"apache","extensions":["m4v"]},
	"video/x-matroska": {"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},
	"video/x-mng": {"source":"apache","extensions":["mng"]},
	"video/x-ms-asf": {"source":"apache","extensions":["asf","asx"]},
	"video/x-ms-vob": {"source":"apache","extensions":["vob"]},
	"video/x-ms-wm": {"source":"apache","extensions":["wm"]},
	"video/x-ms-wmv": {"source":"apache","compressible":false,"extensions":["wmv"]},
	"video/x-ms-wmx": {"source":"apache","extensions":["wmx"]},
	"video/x-ms-wvx": {"source":"apache","extensions":["wvx"]},
	"video/x-msvideo": {"source":"apache","extensions":["avi"]},
	"video/x-sgi-movie": {"source":"apache","extensions":["movie"]},
	"video/x-smv": {"source":"apache","extensions":["smv"]},
	"x-conference/x-cooltalk": {"source":"apache","extensions":["ice"]},
	"x-shader/x-fragment": {"compressible":true},
	"x-shader/x-vertex": {"compressible":true}
};

var db$1 = Object.freeze({
	default: db
});

var require$$0$46 = ( db$1 && db ) || db$1;

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

/**
 * Module exports.
 */

var mimeDb = require$$0$46;

var mimeTypes = createCommonjsModule(function (module, exports) {
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var extname = path.extname;

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;

/**
 * Module exports.
 * @public
 */

exports.charset = charset;
exports.charsets = { lookup: charset };
exports.contentType = contentType;
exports.extension = extension;
exports.extensions = Object.create(null);
exports.lookup = lookup;
exports.types = Object.create(null);

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types);

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type);
  var mime = match && mimeDb[match[1].toLowerCase()];

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str;

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime);
    if (charset) mime += '; charset=' + charset.toLowerCase();
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type);

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()];

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path$$1) {
  if (!path$$1 || typeof path$$1 !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path$$1)
    .toLowerCase()
    .substr(1);

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana'];

  Object.keys(mimeDb).forEach(function forEachMimeType (type) {
    var mime = mimeDb[type];
    var exts = mime.extensions;

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts;

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i];

      if (types[extension]) {
        var from = preference.indexOf(mimeDb[types[extension]].source);
        var to = preference.indexOf(mime.source);

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type;
    }
  });
}
});

var mimeTypes_1 = mimeTypes.charset;
var mimeTypes_2 = mimeTypes.charsets;
var mimeTypes_3 = mimeTypes.contentType;
var mimeTypes_4 = mimeTypes.extension;
var mimeTypes_5 = mimeTypes.extensions;
var mimeTypes_6 = mimeTypes.lookup;
var mimeTypes_7 = mimeTypes.types;

var defer_1$2 = defer$3;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer$3(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}

// API
var async_1 = async;

/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */
function async(callback)
{
  var isAsync = false;

  // check if async happened
  defer_1$2(function() { isAsync = true; });

  return function async_callback(err, result)
  {
    if (isAsync)
    {
      callback(err, result);
    }
    else
    {
      defer_1$2(function nextTick_callback()
      {
        callback(err, result);
      });
    }
  };
}

// API
var abort_1 = abort;

/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */
function abort(state)
{
  Object.keys(state.jobs).forEach(clean.bind(state));

  // reset leftover jobs
  state.jobs = {};
}

/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */
function clean(key)
{
  if (typeof this.jobs[key] == 'function')
  {
    this.jobs[key]();
  }
}

// API
var iterate_1 = iterate;

/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */
function iterate(list, iterator, state, callback)
{
  // store current index
  var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

  state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
  {
    // don't repeat yourself
    // skip secondary callbacks
    if (!(key in state.jobs))
    {
      return;
    }

    // clean up jobs
    delete state.jobs[key];

    if (error)
    {
      // don't process rest of the results
      // stop still active jobs
      // and reset the list
      abort_1(state);
    }
    else
    {
      state.results[key] = output;
    }

    // return salvaged results
    callback(error, state.results);
  });
}

/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */
function runJob(iterator, key, item, callback)
{
  var aborter;

  // allow shortcut if iterator expects only two arguments
  if (iterator.length == 2)
  {
    aborter = iterator(item, async_1(callback));
  }
  // otherwise go with full three arguments
  else
  {
    aborter = iterator(item, key, async_1(callback));
  }

  return aborter;
}

// API
var state_1 = state;

/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */
function state(list, sortMethod)
{
  var isNamedList = !Array.isArray(list)
    , initState =
    {
      index    : 0,
      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
      jobs     : {},
      results  : isNamedList ? {} : [],
      size     : isNamedList ? Object.keys(list).length : list.length
    };

  if (sortMethod)
  {
    // sort array keys based on it's values
    // sort object's keys just on own merit
    initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
    {
      return sortMethod(list[a], list[b]);
    });
  }

  return initState;
}

// API
var terminator_1 = terminator;

/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */
function terminator(callback)
{
  if (!Object.keys(this.jobs).length)
  {
    return;
  }

  // fast forward iteration index
  this.index = this.size;

  // abort jobs
  abort_1(this);

  // send back results we have so far
  async_1(callback)(null, this.results);
}

// Public API
var parallel_1 = parallel;

/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function parallel(list, iterator, callback)
{
  var state = state_1(list);

  while (state.index < (state['keyedList'] || list).length)
  {
    iterate_1(list, iterator, state, function(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      // looks like it's the last one
      if (Object.keys(state.jobs).length === 0)
      {
        callback(null, state.results);
        return;
      }
    });

    state.index++;
  }

  return terminator_1.bind(state, callback);
}

// Public API
var serialOrdered_1 = serialOrdered;
// sorting helpers
var ascending_1  = ascending;
var descending_1 = descending;

/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serialOrdered(list, iterator, sortMethod, callback)
{
  var state = state_1(list, sortMethod);

  iterate_1(list, iterator, state, function iteratorHandler(error, result)
  {
    if (error)
    {
      callback(error, result);
      return;
    }

    state.index++;

    // are we there yet?
    if (state.index < (state['keyedList'] || list).length)
    {
      iterate_1(list, iterator, state, iteratorHandler);
      return;
    }

    // done here
    callback(null, state.results);
  });

  return terminator_1.bind(state, callback);
}

/*
 * -- Sort methods
 */

/**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function ascending(a, b)
{
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function descending(a, b)
{
  return -1 * ascending(a, b);
}

serialOrdered_1.ascending = ascending_1;
serialOrdered_1.descending = descending_1;

// Public API
var serial_1 = serial;

/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serial(list, iterator, callback)
{
  return serialOrdered_1(list, iterator, null, callback);
}

var asynckit =
{
  parallel      : parallel_1,
  serial        : serial_1,
  serialOrdered : serialOrdered_1
};

// populates missing values
var populate = function(dst, src) {

  Object.keys(src).forEach(function(prop)
  {
    dst[prop] = dst[prop] || src[prop];
  });

  return dst;
};

var parseUrl = url.parse;





// Public API
var form_data = FormData$1;

// make it a Stream
util.inherits(FormData$1, combined_stream);

/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
 */
function FormData$1(options) {
  if (!(this instanceof FormData$1)) {
    return new FormData$1();
  }

  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];

  combined_stream.call(this);

  options = options || {};
  for (var option in options) {
    this[option] = options[option];
  }
}

FormData$1.LINE_BREAK = '\r\n';
FormData$1.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

FormData$1.prototype.append = function(field, value, options) {

  options = options || {};

  // allow filename as single option
  if (typeof options == 'string') {
    options = {filename: options};
  }

  var append = combined_stream.prototype.append.bind(this);

  // all that streamy business can't handle numbers
  if (typeof value == 'number') {
    value = '' + value;
  }

  // https://github.com/felixge/node-form-data/issues/38
  if (util.isArray(value)) {
    // Please convert your array into string
    // the way web server expects it
    this._error(new Error('Arrays are not supported.'));
    return;
  }

  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();

  append(header);
  append(value);
  append(footer);

  // pass along options.knownLength
  this._trackLength(header, value, options);
};

FormData$1.prototype._trackLength = function(header, value, options) {
  var valueLength = 0;

  // used w/ getLengthSync(), when length is known.
  // e.g. for streaming directly from a remote server,
  // w/ a known file a size, and not wanting to wait for
  // incoming file to finish to get its size.
  if (options.knownLength != null) {
    valueLength += +options.knownLength;
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === 'string') {
    valueLength = Buffer.byteLength(value);
  }

  this._valueLength += valueLength;

  // @check why add CRLF? does this account for custom/multiple CRLFs?
  this._overheadLength +=
    Buffer.byteLength(header) +
    FormData$1.LINE_BREAK.length;

  // empty or either doesn't have path or not an http response
  if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) )) {
    return;
  }

  // no need to bother with the length
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};

FormData$1.prototype._lengthRetriever = function(value, callback) {

  if (value.hasOwnProperty('fd')) {

    // take read range into a account
    // `end` = Infinity –> read file till the end
    //
    // TODO: Looks like there is bug in Node fs.createReadStream
    // it doesn't respect `end` options without `start` options
    // Fix it when node fixes it.
    // https://github.com/joyent/node/issues/7819
    if (value.end != undefined && value.end != Infinity && value.start != undefined) {

      // when end specified
      // no need to calculate range
      // inclusive, starts with 0
      callback(null, value.end + 1 - (value.start ? value.start : 0));

    // not that fast snoopy
    } else {
      // still need to fetch file size from fs
      fs.stat(value.path, function(err, stat) {

        var fileSize;

        if (err) {
          callback(err);
          return;
        }

        // update final size based on the range options
        fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }

  // or http response
  } else if (value.hasOwnProperty('httpVersion')) {
    callback(null, +value.headers['content-length']);

  // or request stream http://github.com/mikeal/request
  } else if (value.hasOwnProperty('httpModule')) {
    // wait till response come back
    value.on('response', function(response) {
      value.pause();
      callback(null, +response.headers['content-length']);
    });
    value.resume();

  // something else
  } else {
    callback('Unknown stream');
  }
};

FormData$1.prototype._multiPartHeader = function(field, value, options) {
  // custom header specified (as string)?
  // it becomes responsible for boundary
  // (e.g. to handle extra CRLFs on .NET servers)
  if (typeof options.header == 'string') {
    return options.header;
  }

  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);

  var contents = '';
  var headers  = {
    // add custom disposition as third element or keep it two elements if not
    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    'Content-Type': [].concat(contentType || [])
  };

  // allow custom headers.
  if (typeof options.header == 'object') {
    populate(headers, options.header);
  }

  var header;
  for (var prop in headers) {
    if (!headers.hasOwnProperty(prop)) continue;
    header = headers[prop];

    // skip nullish headers.
    if (header == null) {
      continue;
    }

    // convert all headers to arrays.
    if (!Array.isArray(header)) {
      header = [header];
    }

    // add non-empty headers.
    if (header.length) {
      contents += prop + ': ' + header.join('; ') + FormData$1.LINE_BREAK;
    }
  }

  return '--' + this.getBoundary() + FormData$1.LINE_BREAK + contents + FormData$1.LINE_BREAK;
};

FormData$1.prototype._getContentDisposition = function(value, options) {

  var filename
    , contentDisposition;

  if (typeof options.filepath === 'string') {
    // custom filepath for relative paths
    filename = path.normalize(options.filepath).replace(/\\/g, '/');
  } else if (options.filename || value.name || value.path) {
    // custom filename take precedence
    // formidable and the browser add a name property
    // fs- and request- streams have path property
    filename = path.basename(options.filename || value.name || value.path);
  } else if (value.readable && value.hasOwnProperty('httpVersion')) {
    // or try http response
    filename = path.basename(value.client._httpMessage.path);
  }

  if (filename) {
    contentDisposition = 'filename="' + filename + '"';
  }

  return contentDisposition;
};

FormData$1.prototype._getContentType = function(value, options) {

  // use custom content-type above all
  var contentType = options.contentType;

  // or try `name` from formidable, browser
  if (!contentType && value.name) {
    contentType = mimeTypes.lookup(value.name);
  }

  // or try `path` from fs-, request- streams
  if (!contentType && value.path) {
    contentType = mimeTypes.lookup(value.path);
  }

  // or if it's http-reponse
  if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
    contentType = value.headers['content-type'];
  }

  // or guess it from the filepath or filename
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mimeTypes.lookup(options.filepath || options.filename);
  }

  // fallback to the default content type if `value` is not simple value
  if (!contentType && typeof value == 'object') {
    contentType = FormData$1.DEFAULT_CONTENT_TYPE;
  }

  return contentType;
};

FormData$1.prototype._multiPartFooter = function() {
  return function(next) {
    var footer = FormData$1.LINE_BREAK;

    var lastPart = (this._streams.length === 0);
    if (lastPart) {
      footer += this._lastBoundary();
    }

    next(footer);
  }.bind(this);
};

FormData$1.prototype._lastBoundary = function() {
  return '--' + this.getBoundary() + '--' + FormData$1.LINE_BREAK;
};

FormData$1.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };

  for (header in userHeaders) {
    if (userHeaders.hasOwnProperty(header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }

  return formHeaders;
};

FormData$1.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData$1.prototype._generateBoundary = function() {
  // This generates a 50 character boundary similar to those used by Firefox.
  // They are optimized for boyer-moore parsing.
  var boundary = '--------------------------';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  this._boundary = boundary;
};

// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually
// and add it as knownLength option
FormData$1.prototype.getLengthSync = function() {
  var knownLength = this._overheadLength + this._valueLength;

  // Don't get confused, there are 3 "internal" streams for each keyval pair
  // so it basically checks if there is any value added to the form
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  // https://github.com/form-data/form-data/issues/40
  if (!this.hasKnownLength()) {
    // Some async length retrievers are present
    // therefore synchronous length calculation is false.
    // Please use getLength(callback) to get proper length
    this._error(new Error('Cannot calculate proper length in synchronous way.'));
  }

  return knownLength;
};

// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData$1.prototype.hasKnownLength = function() {
  var hasKnownLength = true;

  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }

  return hasKnownLength;
};

FormData$1.prototype.getLength = function(cb) {
  var knownLength = this._overheadLength + this._valueLength;

  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }

  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
    if (err) {
      cb(err);
      return;
    }

    values.forEach(function(length) {
      knownLength += length;
    });

    cb(null, knownLength);
  });
};

FormData$1.prototype.submit = function(params, cb) {
  var request
    , options
    , defaults = {method: 'post'};

  // parse provided url if it's string
  // or treat it as options object
  if (typeof params == 'string') {

    params = parseUrl(params);
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults);

  // use custom params
  } else {

    options = populate(params, defaults);
    // if no port provided use default one
    if (!options.port) {
      options.port = options.protocol == 'https:' ? 443 : 80;
    }
  }

  // put that good code in getHeaders to some use
  options.headers = this.getHeaders(params.headers);

  // https if specified, fallback to http in any other case
  if (options.protocol == 'https:') {
    request = https.request(options);
  } else {
    request = http.request(options);
  }

  // get content length and fire away
  this.getLength(function(err, length) {
    if (err) {
      this._error(err);
      return;
    }

    // add content length
    request.setHeader('Content-Length', length);

    this.pipe(request);
    if (cb) {
      request.on('error', cb);
      request.on('response', cb.bind(this, null));
    }
  }.bind(this));

  return request;
};

FormData$1.prototype._error = function(err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit('error', err);
  }
};

FormData$1.prototype.toString = function () {
  return '[object FormData]';
};

var TestService = function () {
  function TestService(option) {
    _classCallCheck(this, TestService);

    option = option || {};
    this.port = option.port || 7001;
    this.host = option.host || 'localhost';
    this.subscribeMap = {};
  }

  _createClass(TestService, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        _this.socket = lib$4.connect('http://' + _this.host + ':' + _this.port + '/');
        _this.socket.on('connect', function () {
          resolve(1);
          _this.socket.emit('identity', 'remote');
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
        });
        _this.socket.on('connect_error', function () {
          reject('connect_error');
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
          delete _this.socket;
        });
      });
    }

    /**
     * load test script
     */

  }, {
    key: 'loadTestCase',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(tasklist) {
        var res;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.socket) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/ts/testcase', { tasklist: tasklist });

              case 4:
                res = _context.sent;
                return _context.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadTestCase(_x) {
        return _ref.apply(this, arguments);
      }

      return loadTestCase;
    }()
  }, {
    key: 'loadTestCaseData',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(tasklist) {
        var res;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.socket) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context2.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/ts/testcase/data', { tasklist: tasklist });

              case 4:
                res = _context2.sent;
                return _context2.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function loadTestCaseData(_x2) {
        return _ref2.apply(this, arguments);
      }

      return loadTestCaseData;
    }()
    /**
     * get current test script list
     */

  }, {
    key: 'getTestCaseList',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var res;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.socket) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context3.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/ts/testcase');

              case 4:
                res = _context3.sent;
                return _context3.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getTestCaseList() {
        return _ref3.apply(this, arguments);
      }

      return getTestCaseList;
    }()
  }, {
    key: 'getTestCaseByID',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(ID) {
        var res;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.socket) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context4.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/ts/testcase/' + ID);

              case 4:
                res = _context4.sent;
                return _context4.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getTestCaseByID(_x3) {
        return _ref4.apply(this, arguments);
      }

      return getTestCaseByID;
    }()

    /**
     * delete test script by ID
     */

  }, {
    key: 'deleteTestCase',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(ID) {
        var res;
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.socket) {
                  _context5.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context5.next = 4;
                return axios$1.delete('http://' + this.host + ':' + this.port + '/ts/testcase?id=' + ID);

              case 4:
                res = _context5.sent;
                return _context5.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function deleteTestCase(_x4) {
        return _ref5.apply(this, arguments);
      }

      return deleteTestCase;
    }()

    /**
     * delete all test script
     */

  }, {
    key: 'deleteAllTestCases',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6() {
        var res;
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.socket) {
                  _context6.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context6.next = 4;
                return axios$1.delete('http://' + this.host + ':' + this.port + '/ts/testcase');

              case 4:
                res = _context6.sent;
                return _context6.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function deleteAllTestCases() {
        return _ref6.apply(this, arguments);
      }

      return deleteAllTestCases;
    }()
  }, {
    key: 'start',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7() {
        var res;
        return regenerator.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (this.socket) {
                  _context7.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context7.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/ts/start');

              case 4:
                res = _context7.sent;
                return _context7.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function start() {
        return _ref7.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'stop',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8() {
        var res;
        return regenerator.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (this.socket) {
                  _context8.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context8.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/ts/stop');

              case 4:
                res = _context8.sent;
                return _context8.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function stop() {
        return _ref8.apply(this, arguments);
      }

      return stop;
    }()
  }, {
    key: 'pause',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee9() {
        var res;
        return regenerator.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (this.socket) {
                  _context9.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context9.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/ts/pause');

              case 4:
                res = _context9.sent;
                return _context9.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function pause() {
        return _ref9.apply(this, arguments);
      }

      return pause;
    }()
  }, {
    key: 'resume',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee10() {
        var res;
        return regenerator.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (this.socket) {
                  _context10.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context10.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/ts/resume');

              case 4:
                res = _context10.sent;
                return _context10.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function resume() {
        return _ref10.apply(this, arguments);
      }

      return resume;
    }()
    //{softwareVersion : ''}

  }, {
    key: 'setBenchConfig',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee11(benchConfig) {
        var res;
        return regenerator.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (this.socket) {
                  _context11.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context11.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/ts/benchconfig', benchConfig);

              case 4:
                res = _context11.sent;
                return _context11.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function setBenchConfig(_x5) {
        return _ref11.apply(this, arguments);
      }

      return setBenchConfig;
    }()
  }, {
    key: 'getBenchConfig',
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee12() {
        var res;
        return regenerator.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (this.socket) {
                  _context12.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context12.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/ts/benchconfig');

              case 4:
                res = _context12.sent;
                return _context12.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getBenchConfig() {
        return _ref12.apply(this, arguments);
      }

      return getBenchConfig;
    }()

    /**
     * 
     * @param {stream.Readable} caseFile test case file as a buffer object
     */

  }, {
    key: 'uploadTestcase',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee13(dirname, filename, caseFile) {
        var form, getHeaders, res;
        return regenerator.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (this.socket) {
                  _context13.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                form = new form_data();

                form.append('file', caseFile, filename);

                getHeaders = function getHeaders(form) {
                  return new _Promise(function (resolve, reject) {
                    form.getLength(function (err, length) {
                      if (err) reject(err);
                      var headers = _Object$assign({
                        'Content-Length': length
                      }, form.getHeaders());
                      resolve(headers);
                    });
                  });
                };

                _context13.t0 = axios$1;
                _context13.t1 = 'http://' + this.host + ':8080/api/filemanage/upload?dirname=' + dirname;
                _context13.t2 = form;
                _context13.next = 10;
                return getHeaders(form);

              case 10:
                _context13.t3 = _context13.sent;
                _context13.t4 = {
                  headers: _context13.t3
                };
                _context13.next = 14;
                return _context13.t0.post.call(_context13.t0, _context13.t1, _context13.t2, _context13.t4);

              case 14:
                res = _context13.sent;
                return _context13.abrupt('return', res.data);

              case 16:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function uploadTestcase(_x6, _x7, _x8) {
        return _ref13.apply(this, arguments);
      }

      return uploadTestcase;
    }()
  }]);

  return TestService;
}();

var POWERSwitch = function () {
  function POWERSwitch(option) {
    _classCallCheck(this, POWERSwitch);

    this.port = option.port || 6007;
    this.host = option.host || 'localhost';
    this.subscribeMap = {};
  }

  _createClass(POWERSwitch, [{
    key: 'connect',
    value: function connect(type) {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        _this.socket = lib$4.connect('http://' + _this.host + ':' + _this.port + '/');
        _this.socket.on('connect', function () {
          resolve(1);
          _this.socket.emit('identity', type);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
        });
        _this.socket.on('connect_error', function () {
          reject(1);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
          delete _this.socket;
        });
      });
    }

    /**
     * poweron
     */

  }, {
    key: 'powerOn',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.socket) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Power Switch service not ready');

              case 2:
                _context.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/poweron');

              case 4:
                return _context.abrupt('return', true);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function powerOn() {
        return _ref.apply(this, arguments);
      }

      return powerOn;
    }()

    /**
     * poweroff
     */

  }, {
    key: 'powerOff',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.socket) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('Power Switch service not ready');

              case 2:
                _context2.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/poweroff');

              case 4:
                return _context2.abrupt('return', true);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function powerOff() {
        return _ref2.apply(this, arguments);
      }

      return powerOff;
    }()
    /**
     * selectdevice
     */

  }, {
    key: 'selectDevice',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(addr) {
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.socket) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('Power Switch service not ready');

              case 2:
                _context3.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/selectdevice', { addr: addr });

              case 4:
                return _context3.abrupt('return', true);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function selectDevice(_x) {
        return _ref3.apply(this, arguments);
      }

      return selectDevice;
    }()
    /**
     * readcurrent
     */

  }, {
    key: 'readCurrent',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
        var res;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.socket) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('Current monitoring service not ready');

              case 2:
                _context4.next = 4;
                return axios$1.get('http://' + this.host + ':' + this.port + '/readcurrent');

              case 4:
                res = _context4.sent;
                return _context4.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function readCurrent() {
        return _ref4.apply(this, arguments);
      }

      return readCurrent;
    }()
    /**
     * usbconnect
     */

  }, {
    key: 'usbConnect',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.socket) {
                  _context5.next = 2;
                  break;
                }

                throw new Error('USB Switch service not ready');

              case 2:
                _context5.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/usbconnect');

              case 4:
                return _context5.abrupt('return', true);

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function usbConnect() {
        return _ref5.apply(this, arguments);
      }

      return usbConnect;
    }()
    /**
     * usbdisconnect
     */

  }, {
    key: 'usbDisconnect',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6() {
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.socket) {
                  _context6.next = 2;
                  break;
                }

                throw new Error('USB Switch service not ready');

              case 2:
                _context6.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/usbdisconnect');

              case 4:
                return _context6.abrupt('return', true);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function usbDisconnect() {
        return _ref6.apply(this, arguments);
      }

      return usbDisconnect;
    }()
  }]);

  return POWERSwitch;
}();

var VoiceService = function () {
  function VoiceService(option) {
    _classCallCheck(this, VoiceService);

    option = option || {};
    this.port = option.port || 6015;
    this.host = option.host || 'localhost';
  }

  _createClass(VoiceService, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        _this.socket = lib$4.connect('http://' + _this.host + ':' + _this.port + '/');
        _this.socket.on('connect', function () {
          resolve(1);
          _this.socket.emit('identity', 'remote');
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
        });
        _this.socket.on('connect_error', function () {
          reject(1);
          _this.socket.removeAllListeners('connect');
          _this.socket.removeAllListeners('connect_error');
          delete _this.socket;
        });
      });
    }

    /**
     * play voice on ZDBox
     */

  }, {
    key: 'play',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(db, text) {
        var res;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.socket) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/voiceDB/local/play', {
                  db: db,
                  text: text
                });

              case 4:
                res = _context.sent;
                return _context.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function play(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return play;
    }()

    /**
     * record voice
     */

  }, {
    key: 'record',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(db, text) {
        var res;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.socket) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context2.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/voiceDB/local/record', {
                  db: db,
                  text: text
                });

              case 4:
                res = _context2.sent;
                return _context2.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function record(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return record;
    }()

    /**
     * record (Audi TTS engine) voice 
     */

  }, {
    key: 'recordAudiTTS',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(text) {
        var res;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.socket) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context3.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/voiceDB/local/recordauditts', {
                  text: text
                });

              case 4:
                res = _context3.sent;
                return _context3.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function recordAudiTTS(_x5) {
        return _ref3.apply(this, arguments);
      }

      return recordAudiTTS;
    }()

    /**
     * check if voice aviliable
     */

  }, {
    key: 'checkVoice',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(db, text) {
        var res;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.socket) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context4.next = 4;
                return axios$1.post('http://' + this.host + ':' + this.port + '/voiceDB/database/checkvoice', {
                  db: db, text: text
                });

              case 4:
                res = _context4.sent;
                return _context4.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function checkVoice(_x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return checkVoice;
    }()

    /**
     * delete voice in db
     */

  }, {
    key: 'deleteVoice',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(db, text) {
        var res;
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.socket) {
                  _context5.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context5.next = 4;
                return axios$1.delete('http://' + this.host + ':' + this.port + '/voiceDB/database/checkvoice', {
                  db: db, text: text
                });

              case 4:
                res = _context5.sent;
                return _context5.abrupt('return', res.data);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function deleteVoice(_x8, _x9) {
        return _ref5.apply(this, arguments);
      }

      return deleteVoice;
    }()

    /**
     * delete all voice for voice database
     * @param {voice db} db 
     */

  }, {
    key: 'deleteAllVoice',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(db) {
        var res;
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.socket) {
                  _context6.next = 2;
                  break;
                }

                throw new Error('Service not ready');

              case 2:
                _context6.next = 4;
                return axios$1.delete('http://' + this.host + ':' + this.port + '/voiceDB/database/allvoices', {
                  db: db
                });

              case 4:
                res = _context6.sent;
                return _context6.abrupt('return', res.data.screenID);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function deleteAllVoice(_x10) {
        return _ref6.apply(this, arguments);
      }

      return deleteAllVoice;
    }()
  }]);

  return VoiceService;
}();

var SWAG = {
  AndroidProberProxy: AdroidProberProxy,
  TraceServer: TraceServer,
  TTS: tts,
  AudiMainUnit: MainUnit,
  CANTrace: CANTrace,
  BAPTrace: BAPTrace,
  Simulation: Simulation,
  TestService: TestService,
  PowerSwitch: POWERSwitch,
  VoiceService: VoiceService
};

// Load all service classes

module.exports = SWAG;
