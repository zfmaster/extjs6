var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.defineProperty = typeof Object.defineProperties == 'function' ? Object.defineProperty : function(target, property, descriptor) {
  descriptor = (descriptor);
  if (target == Array.prototype || target == Object.prototype) {
    return;
  }
  target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
  return typeof window != 'undefined' && window === maybeGlobal ? maybeGlobal : typeof global != 'undefined' && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  if (!polyfill) {
    return;
  }
  var obj = $jscomp.global;
  var split = target.split('.');
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  var property = split[split.length - 1];
  var orig = obj[property];
  var impl = polyfill(orig);
  if (impl == orig || impl == null) {
    return;
  }
  $jscomp.defineProperty(obj, property, {configurable:true, writable:true, value:impl});
};
$jscomp.polyfill('Array.prototype.copyWithin', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, start, opt_end) {
    var len = this.length;
    target = Number(target);
    start = Number(start);
    opt_end = Number(opt_end != null ? opt_end : len);
    if (target < start) {
      opt_end = Math.min(opt_end, len);
      while (start < opt_end) {
        if (start in this) {
          this[target++] = this[start++];
        } else {
          delete this[target++];
          start++;
        }
      }
    } else {
      opt_end = Math.min(opt_end, len + start - target);
      target += opt_end - start;
      while (opt_end > start) {
        if (--opt_end in this) {
          this[--target] = this[opt_end];
        } else {
          delete this[target];
        }
      }
    }
    return this;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  if (!$jscomp.global['Symbol']) {
    $jscomp.global['Symbol'] = $jscomp.Symbol;
  }
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(opt_description) {
  return ($jscomp.SYMBOL_PREFIX + (opt_description || '') + $jscomp.symbolCounter_++);
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global['Symbol'].iterator;
  if (!symbolIterator) {
    symbolIterator = $jscomp.global['Symbol'].iterator = $jscomp.global['Symbol']('iterator');
  }
  if (typeof Array.prototype[symbolIterator] != 'function') {
    $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:true, writable:true, value:function() {
      return $jscomp.arrayIterator(this);
    }});
  }
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    if (index < array.length) {
      return {done:false, value:array[index++]};
    } else {
      return {done:true};
    }
  });
};
$jscomp.iteratorPrototype = function(next) {
  $jscomp.initSymbolIterator();
  var iterator = {next:next};
  iterator[$jscomp.global['Symbol'].iterator] = function() {
    return this;
  };
  return (iterator);
};
$jscomp.iteratorFromArray = function(array, transform) {
  $jscomp.initSymbolIterator();
  if (array instanceof String) {
    array = array + '';
  }
  var i = 0;
  var iter = {next:function() {
    if (i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:false};
    }
    iter.next = function() {
      return {done:true, value:void 0};
    };
    return iter.next();
  }};
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill('Array.prototype.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i, v) {
      return [i, v];
    });
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.fill', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(value, opt_start, opt_end) {
    var length = this.length || 0;
    if (opt_start < 0) {
      opt_start = Math.max(0, length + (opt_start));
    }
    if (opt_end == null || opt_end > length) {
      opt_end = length;
    }
    opt_end = Number(opt_end);
    if (opt_end < 0) {
      opt_end = Math.max(0, length + opt_end);
    }
    for (var i = Number(opt_start || 0); i < opt_end; i++) {
      this[i] = value;
    }
    return this;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.findInternal = function(array, callback, thisArg) {
  if (array instanceof String) {
    array = (String(array));
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var value = array[i];
    if (callback.call(thisArg, value, i, array)) {
      return {i:i, v:value};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill('Array.prototype.find', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).v;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.findIndex', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).i;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.from', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
    $jscomp.initSymbolIterator();
    opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) {
      return x;
    };
    var result = [];
    var iteratorFunction = (arrayLike)[Symbol.iterator];
    if (typeof iteratorFunction == 'function') {
      arrayLike = iteratorFunction.call(arrayLike);
      var next;
      while (!(next = arrayLike.next()).done) {
        result.push(opt_mapFn.call((opt_thisArg), next.value));
      }
    } else {
      var len = arrayLike.length;
      for (var i = 0; i < len; i++) {
        result.push(opt_mapFn.call((opt_thisArg), arrayLike[i]));
      }
    }
    return result;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.is', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(left, right) {
    if (left === right) {
      return left !== 0 || 1 / left === 1 / (right);
    } else {
      return left !== left && right !== right;
    }
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var includes = function(searchElement, opt_fromIndex) {
    var array = this;
    if (array instanceof String) {
      array = (String(array));
    }
    var len = array.length;
    for (var i = opt_fromIndex || 0; i < len; i++) {
      if (array[i] == searchElement || Object.is(array[i], searchElement)) {
        return true;
      }
    }
    return false;
  };
  return includes;
}, 'es7', 'es3');
$jscomp.polyfill('Array.prototype.keys', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.of', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    return Array.from(arguments);
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.values', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(k, v) {
      return v;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.makeIterator = function(iterable) {
  $jscomp.initSymbolIterator();
  var iteratorFunction = (iterable)[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator((iterable));
};
$jscomp.EXPOSE_ASYNC_EXECUTOR = true;
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill('Promise', function(NativePromise) {
  if (NativePromise && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return NativePromise;
  }
  function AsyncExecutor() {
    this.batch_ = null;
  }
  AsyncExecutor.prototype.asyncExecute = function(f) {
    if (this.batch_ == null) {
      this.batch_ = [];
      this.asyncExecuteBatch_();
    }
    this.batch_.push(f);
    return this;
  };
  AsyncExecutor.prototype.asyncExecuteBatch_ = function() {
    var self = this;
    this.asyncExecuteFunction(function() {
      self.executeBatch_();
    });
  };
  var nativeSetTimeout = $jscomp.global['setTimeout'];
  AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
    nativeSetTimeout(f, 0);
  };
  AsyncExecutor.prototype.executeBatch_ = function() {
    while (this.batch_ && this.batch_.length) {
      var executingBatch = this.batch_;
      this.batch_ = [];
      for (var i = 0; i < executingBatch.length; ++i) {
        var f = executingBatch[i];
        delete executingBatch[i];
        try {
          f();
        } catch (error) {
          this.asyncThrow_(error);
        }
      }
    }
    this.batch_ = null;
  };
  AsyncExecutor.prototype.asyncThrow_ = function(exception) {
    this.asyncExecuteFunction(function() {
      throw exception;
    });
  };
  var PromiseState = {PENDING:0, FULFILLED:1, REJECTED:2};
  var PolyfillPromise = function(executor) {
    this.state_ = PromiseState.PENDING;
    this.result_ = undefined;
    this.onSettledCallbacks_ = [];
    var resolveAndReject = this.createResolveAndReject_();
    try {
      executor(resolveAndReject.resolve, resolveAndReject.reject);
    } catch (e) {
      resolveAndReject.reject(e);
    }
  };
  PolyfillPromise.prototype.createResolveAndReject_ = function() {
    var thisPromise = this;
    var alreadyCalled = false;
    function firstCallWins(method) {
      return function(x) {
        if (!alreadyCalled) {
          alreadyCalled = true;
          method.call(thisPromise, x);
        }
      };
    }
    return {resolve:firstCallWins(this.resolveTo_), reject:firstCallWins(this.reject_)};
  };
  PolyfillPromise.prototype.resolveTo_ = function(value) {
    if (value === this) {
      this.reject_(new TypeError('A Promise cannot resolve to itself'));
    } else {
      if (value instanceof PolyfillPromise) {
        this.settleSameAsPromise_((value));
      } else {
        if (isObject(value)) {
          this.resolveToNonPromiseObj_((value));
        } else {
          this.fulfill_(value);
        }
      }
    }
  };
  PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
    var thenMethod = undefined;
    try {
      thenMethod = obj.then;
    } catch (error) {
      this.reject_(error);
      return;
    }
    if (typeof thenMethod == 'function') {
      this.settleSameAsThenable_(thenMethod, (obj));
    } else {
      this.fulfill_(obj);
    }
  };
  function isObject(value) {
    switch(typeof value) {
      case 'object':
        return value != null;
      case 'function':
        return true;
      default:
        return false;
    }
  }
  PolyfillPromise.prototype.reject_ = function(reason) {
    this.settle_(PromiseState.REJECTED, reason);
  };
  PolyfillPromise.prototype.fulfill_ = function(value) {
    this.settle_(PromiseState.FULFILLED, value);
  };
  PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
    if (this.state_ != PromiseState.PENDING) {
      throw new Error('Cannot settle(' + settledState + ', ' + valueOrReason | '): Promise already settled in state' + this.state_);
    }
    this.state_ = settledState;
    this.result_ = valueOrReason;
    this.executeOnSettledCallbacks_();
  };
  PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
    if (this.onSettledCallbacks_ != null) {
      var callbacks = this.onSettledCallbacks_;
      for (var i = 0; i < callbacks.length; ++i) {
        (callbacks[i]).call();
        callbacks[i] = null;
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var asyncExecutor = new AsyncExecutor;
  PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
    var methods = this.createResolveAndReject_();
    promise.callWhenSettled_(methods.resolve, methods.reject);
  };
  PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
    var methods = this.createResolveAndReject_();
    try {
      thenMethod.call(thenable, methods.resolve, methods.reject);
    } catch (error) {
      methods.reject(error);
    }
  };
  PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
    var resolveChild;
    var rejectChild;
    var childPromise = new PolyfillPromise(function(resolve, reject) {
      resolveChild = resolve;
      rejectChild = reject;
    });
    function createCallback(paramF, defaultF) {
      if (typeof paramF == 'function') {
        return function(x) {
          try {
            resolveChild(paramF(x));
          } catch (error) {
            rejectChild(error);
          }
        };
      } else {
        return defaultF;
      }
    }
    this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
    return childPromise;
  };
  PolyfillPromise.prototype['catch'] = function(onRejected) {
    return this.then(undefined, onRejected);
  };
  PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
    var thisPromise = this;
    function callback() {
      switch(thisPromise.state_) {
        case PromiseState.FULFILLED:
          onFulfilled(thisPromise.result_);
          break;
        case PromiseState.REJECTED:
          onRejected(thisPromise.result_);
          break;
        default:
          throw new Error('Unexpected state: ' + thisPromise.state_);
      }
    }
    if (this.onSettledCallbacks_ == null) {
      asyncExecutor.asyncExecute(callback);
    } else {
      this.onSettledCallbacks_.push(function() {
        asyncExecutor.asyncExecute(callback);
      });
    }
  };
  PolyfillPromise.resolve = function(opt_value) {
    if (opt_value instanceof PolyfillPromise) {
      return opt_value;
    } else {
      return new PolyfillPromise(function(resolve, reject) {
        resolve(opt_value);
      });
    }
  };
  PolyfillPromise.reject = function(opt_reason) {
    return new PolyfillPromise(function(resolve, reject) {
      reject(opt_reason);
    });
  };
  PolyfillPromise.race = function(thenablesOrValues) {
    return new PolyfillPromise(function(resolve, reject) {
      var iterator = $jscomp.makeIterator(thenablesOrValues);
      for (var iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
        PolyfillPromise.resolve(iterRec.value).callWhenSettled_(resolve, reject);
      }
    });
  };
  PolyfillPromise.all = function(thenablesOrValues) {
    var iterator = $jscomp.makeIterator(thenablesOrValues);
    var iterRec = iterator.next();
    if (iterRec.done) {
      return PolyfillPromise.resolve([]);
    } else {
      return new PolyfillPromise(function(resolveAll, rejectAll) {
        var resultsArray = [];
        var unresolvedCount = 0;
        function onFulfilled(i) {
          return function(ithResult) {
            resultsArray[i] = ithResult;
            unresolvedCount--;
            if (unresolvedCount == 0) {
              resolveAll(resultsArray);
            }
          };
        }
        do {
          resultsArray.push(undefined);
          unresolvedCount++;
          PolyfillPromise.resolve(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll);
          iterRec = iterator.next();
        } while (!iterRec.done);
      });
    }
  };
  if ($jscomp.EXPOSE_ASYNC_EXECUTOR) {
    PolyfillPromise['$jscomp$new$AsyncExecutor'] = function() {
      return new AsyncExecutor;
    };
  }
  return PolyfillPromise;
}, 'es6-impl', 'es3');
$jscomp.executeAsyncGenerator = function(generator) {
  function passValueToGenerator(value) {
    return generator.next(value);
  }
  function passErrorToGenerator(error) {
    return generator['throw'](error);
  }
  return new Promise(function(resolve, reject) {
    function handleGeneratorRecord(genRec) {
      if (genRec.done) {
        resolve(genRec.value);
      } else {
        Promise.resolve(genRec.value).then(passValueToGenerator, passErrorToGenerator).then(handleGeneratorRecord, reject);
      }
    }
    handleGeneratorRecord(generator.next());
  });
};
$jscomp.owns = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill('WeakMap', function(NativeWeakMap) {
  function isConformant() {
    if (!NativeWeakMap || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var map = new (NativeWeakMap)([[x, 2], [y, 3]]);
      if (map.get(x) != 2 || map.get(y) != 3) {
        return false;
      }
      map['delete'](x);
      map.set(y, 4);
      return !map.has(x) && map.get(y) == 4;
    } catch (err) {
      return false;
    }
  }
  if (isConformant()) {
    return NativeWeakMap;
  }
  var prop = '$jscomp_hidden_' + Math.random().toString().substring(2);
  function insert(target) {
    if (!$jscomp.owns(target, prop)) {
      var obj = {};
      $jscomp.defineProperty(target, prop, {value:obj});
    }
  }
  function patch(name) {
    var prev = Object[name];
    if (prev) {
      Object[name] = function(target) {
        insert(target);
        return prev(target);
      };
    }
  }
  patch('freeze');
  patch('preventExtensions');
  patch('seal');
  var index = 0;
  var PolyfillWeakMap = function(opt_iterable) {
    this.id_ = (index += Math.random() + 1).toString();
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set((item[0]), (item[1]));
      }
    }
  };
  PolyfillWeakMap.prototype.set = function(key, value) {
    insert(key);
    if (!$jscomp.owns(key, prop)) {
      throw new Error('WeakMap key fail: ' + key);
    }
    key[prop][this.id_] = value;
    return this;
  };
  PolyfillWeakMap.prototype.get = function(key) {
    return $jscomp.owns(key, prop) ? key[prop][this.id_] : undefined;
  };
  PolyfillWeakMap.prototype.has = function(key) {
    return $jscomp.owns(key, prop) && $jscomp.owns(key[prop], this.id_);
  };
  PolyfillWeakMap.prototype['delete'] = function(key) {
    if (!$jscomp.owns(key, prop) || !$jscomp.owns(key[prop], this.id_)) {
      return false;
    }
    return delete key[prop][this.id_];
  };
  return PolyfillWeakMap;
}, 'es6-impl', 'es3');
$jscomp.MapEntry = function() {
  this.previous;
  this.next;
  this.head;
  this.key;
  this.value;
};
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.polyfill('Map', function(NativeMap) {
  var isConformant = !$jscomp.ASSUME_NO_NATIVE_MAP && function() {
    if (!NativeMap || !NativeMap.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeMap = (NativeMap);
      var key = Object.seal({x:4});
      var map = new NativeMap($jscomp.makeIterator([[key, 's']]));
      if (map.get(key) != 's' || map.size != 1 || map.get({x:4}) || map.set({x:4}, 't') != map || map.size != 2) {
        return false;
      }
      var iter = map.entries();
      var item = iter.next();
      if (item.done || item.value[0] != key || item.value[1] != 's') {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0].x != 4 || item.value[1] != 't' || !iter.next().done) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }();
  if (isConformant) {
    return NativeMap;
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var idMap = new WeakMap;
  var PolyfillMap = function(opt_iterable) {
    this.data_ = {};
    this.head_ = createHead();
    this.size = 0;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = (entry).value;
        this.set((item[0]), (item[1]));
      }
    }
  };
  PolyfillMap.prototype.set = function(key, value) {
    var r = maybeGetEntry(this, key);
    if (!r.list) {
      r.list = this.data_[r.id] = [];
    }
    if (!r.entry) {
      r.entry = {next:this.head_, previous:this.head_.previous, head:this.head_, key:key, value:value};
      r.list.push(r.entry);
      this.head_.previous.next = r.entry;
      this.head_.previous = r.entry;
      this.size++;
    } else {
      r.entry.value = value;
    }
    return this;
  };
  PolyfillMap.prototype['delete'] = function(key) {
    var r = maybeGetEntry(this, key);
    if (r.entry && r.list) {
      r.list.splice(r.index, 1);
      if (!r.list.length) {
        delete this.data_[r.id];
      }
      r.entry.previous.next = r.entry.next;
      r.entry.next.previous = r.entry.previous;
      r.entry.head = null;
      this.size--;
      return true;
    }
    return false;
  };
  PolyfillMap.prototype.clear = function() {
    this.data_ = {};
    this.head_ = this.head_.previous = createHead();
    this.size = 0;
  };
  PolyfillMap.prototype.has = function(key) {
    return !!maybeGetEntry(this, key).entry;
  };
  PolyfillMap.prototype.get = function(key) {
    var entry = maybeGetEntry(this, key).entry;
    return (entry && (entry.value));
  };
  PolyfillMap.prototype.entries = function() {
    return makeIterator(this, function(entry) {
      return [entry.key, entry.value];
    });
  };
  PolyfillMap.prototype.keys = function() {
    return makeIterator(this, function(entry) {
      return entry.key;
    });
  };
  PolyfillMap.prototype.values = function() {
    return makeIterator(this, function(entry) {
      return entry.value;
    });
  };
  PolyfillMap.prototype.forEach = function(callback, opt_thisArg) {
    var iter = this.entries();
    var item;
    while (!(item = iter.next()).done) {
      var entry = item.value;
      callback.call((opt_thisArg), (entry[1]), (entry[0]), this);
    }
  };
  (PolyfillMap.prototype)[Symbol.iterator] = PolyfillMap.prototype.entries;
  var maybeGetEntry = function(map, key) {
    var id = getId(key);
    var list = map.data_[id];
    if (list && $jscomp.owns(map.data_, id)) {
      for (var index = 0; index < list.length; index++) {
        var entry = list[index];
        if (key !== key && entry.key !== entry.key || key === entry.key) {
          return {id:id, list:list, index:index, entry:entry};
        }
      }
    }
    return {id:id, list:list, index:-1, entry:undefined};
  };
  var makeIterator = function(map, func) {
    var entry = map.head_;
    return $jscomp.iteratorPrototype(function() {
      if (entry) {
        while (entry.head != map.head_) {
          entry = entry.previous;
        }
        while (entry.next != entry.head) {
          entry = entry.next;
          return {done:false, value:func(entry)};
        }
        entry = null;
      }
      return {done:true, value:void 0};
    });
  };
  var createHead = function() {
    var head = {};
    head.previous = head.next = head.head = head;
    return head;
  };
  var mapIndex = 0;
  var getId = function(obj) {
    var type = obj && typeof obj;
    if (type == 'object' || type == 'function') {
      obj = (obj);
      if (!idMap.has(obj)) {
        var id = '' + ++mapIndex;
        idMap.set(obj, id);
        return id;
      }
      return idMap.get(obj);
    }
    return 'p_' + obj;
  };
  return PolyfillMap;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.acosh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return Math.log(x + Math.sqrt(x * x - 1));
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.asinh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log1p', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < 0.25 && x > -0.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      var s = 1;
      while (zPrev != z) {
        y *= x;
        s *= -1;
        z = (zPrev = z) + s * y / ++d;
      }
      return z;
    }
    return Math.log(1 + x);
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.atanh', function(orig) {
  if (orig) {
    return orig;
  }
  var log1p = Math.log1p;
  var polyfill = function(x) {
    x = Number(x);
    return (log1p(x) - log1p(-x)) / 2;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.cbrt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (x === 0) {
      return x;
    }
    x = Number(x);
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.clz32', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x) >>> 0;
    if (x === 0) {
      return 32;
    }
    var result = 0;
    if ((x & 4294901760) === 0) {
      x <<= 16;
      result += 16;
    }
    if ((x & 4278190080) === 0) {
      x <<= 8;
      result += 8;
    }
    if ((x & 4026531840) === 0) {
      x <<= 4;
      result += 4;
    }
    if ((x & 3221225472) === 0) {
      x <<= 2;
      result += 2;
    }
    if ((x & 2147483648) === 0) {
      result++;
    }
    return result;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.cosh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    return (exp(x) + exp(-x)) / 2;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.expm1', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < .25 && x > -.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      while (zPrev != z) {
        y *= x / ++d;
        z = (zPrev = z) + y;
      }
      return z;
    }
    return Math.exp(x) - 1;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.hypot', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x, y, var_args) {
    x = Number(x);
    y = Number(y);
    var i, z, sum;
    var max = Math.max(Math.abs(x), Math.abs(y));
    for (i = 2; i < arguments.length; i++) {
      max = Math.max(max, Math.abs(arguments[i]));
    }
    if (max > 1e100 || max < 1e-100) {
      x = x / max;
      y = y / max;
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]) / max;
        sum += z * z;
      }
      return Math.sqrt(sum) * max;
    } else {
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]);
        sum += z * z;
      }
      return Math.sqrt(sum);
    }
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.imul', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(a, b) {
    a = Number(a);
    b = Number(b);
    var ah = a >>> 16 & 65535;
    var al = a & 65535;
    var bh = b >>> 16 & 65535;
    var bl = b & 65535;
    var lh = ah * bl + al * bh << 16 >>> 0;
    return al * bl + lh | 0;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log10', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN10;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log2', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN2;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.sign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return x === 0 || isNaN(x) ? x : x > 0 ? 1 : -1;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.sinh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    return (exp(x) - exp(-x)) / 2;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.tanh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.exp(-2 * Math.abs(x));
    var z = (1 - y) / (1 + y);
    return x < 0 ? -z : z;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.trunc', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (isNaN(x) || x === Infinity || x === -Infinity || x === 0) {
      return x;
    }
    var y = Math.floor(Math.abs(x));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.EPSILON', function(orig) {
  return Math.pow(2, -52);
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.MAX_SAFE_INTEGER', function() {
  return 9007199254740991;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.MIN_SAFE_INTEGER', function() {
  return -9007199254740991;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isFinite', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (typeof x !== 'number') {
      return false;
    }
    return !isNaN(x) && x !== Infinity && x !== -Infinity;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (!Number.isFinite(x)) {
      return false;
    }
    return x === Math.floor(x);
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isNaN', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return typeof x === 'number' && isNaN(x);
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isSafeInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.assign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, var_args) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (!source) {
        continue;
      }
      for (var key in source) {
        if ($jscomp.owns(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var entries = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push([key, obj[key]]);
      }
    }
    return result;
  };
  return entries;
}, 'es8', 'es3');
$jscomp.polyfill('Object.getOwnPropertySymbols', function(orig) {
  if (orig) {
    return orig;
  }
  return function() {
    return [];
  };
}, 'es6-impl', 'es5');
$jscomp.polyfill('Reflect.ownKeys', function(orig) {
  if (orig) {
    return orig;
  }
  var symbolPrefix = 'jscomp_symbol_';
  function isSymbol(key) {
    return key.substring(0, symbolPrefix.length) == symbolPrefix;
  }
  var polyfill = function(target) {
    var keys = [];
    var names = Object.getOwnPropertyNames(target);
    var symbols = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < names.length; i++) {
      (isSymbol(names[i]) ? symbols : keys).push(names[i]);
    }
    return keys.concat(symbols);
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.getOwnPropertyDescriptors', function(orig) {
  if (orig) {
    return orig;
  }
  var getOwnPropertyDescriptors = function(obj) {
    var result = {};
    var keys = Reflect.ownKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return result;
  };
  return getOwnPropertyDescriptors;
}, 'es8', 'es5');
$jscomp.polyfill('Object.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  }
  if (typeof ''.__proto__ != 'object') {
    return null;
  }
  var polyfill = function(target, proto) {
    target.__proto__ = proto;
    if (target.__proto__ !== proto) {
      throw new TypeError(target + ' is not extensible');
    }
    return target;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.values', function(orig) {
  if (orig) {
    return orig;
  }
  var values = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push(obj[key]);
      }
    }
    return result;
  };
  return values;
}, 'es8', 'es3');
$jscomp.polyfill('Reflect.apply', function(orig) {
  if (orig) {
    return orig;
  }
  var apply = Function.prototype.apply;
  var polyfill = function(target, thisArg, argList) {
    return apply.call(target, thisArg, argList);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.construct', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, argList, opt_newTarget) {
    if (opt_newTarget === undefined) {
      opt_newTarget = target;
    }
    var proto = opt_newTarget.prototype || Object.prototype;
    var obj = Object.create(proto);
    var out = Reflect.apply(target, obj, argList);
    return out || obj;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.defineProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, attributes) {
    try {
      Object.defineProperty(target, propertyKey, attributes);
      var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
      if (!desc) {
        return false;
      }
      return desc.configurable === (attributes.configurable || false) && desc.enumerable === (attributes.enumerable || false) && ('value' in desc ? desc.value === attributes.value && desc.writable === (attributes.writable || false) : desc.get === attributes.get && desc.set === attributes.set);
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.deleteProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    if (!$jscomp.owns(target, propertyKey)) {
      return true;
    }
    try {
      return delete target[propertyKey];
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.getOwnPropertyDescriptor', function(orig) {
  return orig || Object.getOwnPropertyDescriptor;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.getPrototypeOf', function(orig) {
  return orig || Object.getPrototypeOf;
}, 'es6', 'es5');
$jscomp.findDescriptor = function(target, propertyKey) {
  var obj = target;
  while (obj) {
    var property = Reflect.getOwnPropertyDescriptor(obj, propertyKey);
    if (property) {
      return property;
    }
    obj = Reflect.getPrototypeOf(obj);
  }
  return undefined;
};
$jscomp.polyfill('Reflect.get', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, opt_receiver) {
    if (arguments.length <= 2) {
      return target[propertyKey];
    }
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (property) {
      return property.get ? property.get.call(opt_receiver) : property.value;
    }
    return undefined;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.has', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    return propertyKey in target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.isExtensible', function(orig) {
  if (orig) {
    return orig;
  }
  if (typeof Object.isExtensible == 'function') {
    return Object.isExtensible;
  }
  return function() {
    return true;
  };
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.preventExtensions', function(orig) {
  if (orig) {
    return orig;
  }
  if (typeof Object.preventExtensions != 'function') {
    return function() {
      return false;
    };
  }
  var polyfill = function(target) {
    Object.preventExtensions(target);
    return !Object.isExtensible(target);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.set', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, value, opt_receiver) {
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (!property) {
      if (Reflect.isExtensible(target)) {
        target[propertyKey] = value;
        return true;
      }
      return false;
    }
    if (property.set) {
      property.set.call(arguments.length > 3 ? opt_receiver : target, value);
      return true;
    } else {
      if (property.writable && !Object.isFrozen(target)) {
        target[propertyKey] = value;
        return true;
      }
    }
    return false;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  }
  if (typeof ''.__proto__ != 'object') {
    return null;
  }
  var polyfill = function(target, proto) {
    try {
      target.__proto__ = proto;
      return target.__proto__ === proto;
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.polyfill('Set', function(NativeSet) {
  var isConformant = !$jscomp.ASSUME_NO_NATIVE_SET && function() {
    if (!NativeSet || !NativeSet.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeSet = (NativeSet);
      var value = Object.seal({x:4});
      var set = new NativeSet($jscomp.makeIterator([value]));
      if (!set.has(value) || set.size != 1 || set.add(value) != set || set.size != 1 || set.add({x:4}) != set || set.size != 2) {
        return false;
      }
      var iter = set.entries();
      var item = iter.next();
      if (item.done || item.value[0] != value || item.value[1] != value) {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0] == value || item.value[0].x != 4 || item.value[1] != item.value[0]) {
        return false;
      }
      return iter.next().done;
    } catch (err) {
      return false;
    }
  }();
  if (isConformant) {
    return NativeSet;
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var PolyfillSet = function(opt_iterable) {
    this.map_ = new Map;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = (entry).value;
        this.add(item);
      }
    }
    this.size = this.map_.size;
  };
  PolyfillSet.prototype.add = function(value) {
    this.map_.set(value, value);
    this.size = this.map_.size;
    return this;
  };
  PolyfillSet.prototype['delete'] = function(value) {
    var result = this.map_['delete'](value);
    this.size = this.map_.size;
    return result;
  };
  PolyfillSet.prototype.clear = function() {
    this.map_.clear();
    this.size = 0;
  };
  PolyfillSet.prototype.has = function(value) {
    return this.map_.has(value);
  };
  PolyfillSet.prototype.entries = function() {
    return this.map_.entries();
  };
  PolyfillSet.prototype.values = function() {
    return this.map_.values();
  };
  PolyfillSet.prototype.keys = PolyfillSet.prototype.values;
  (PolyfillSet.prototype)[Symbol.iterator] = PolyfillSet.prototype.values;
  PolyfillSet.prototype.forEach = function(callback, opt_thisArg) {
    var set = this;
    this.map_.forEach(function(value) {
      return callback.call((opt_thisArg), value, value, set);
    });
  };
  return PolyfillSet;
}, 'es6-impl', 'es3');
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (thisArg == null) {
    throw new TypeError("The 'this' value for String.prototype." + func + ' must not be null or undefined');
  }
  if (arg instanceof RegExp) {
    throw new TypeError('First argument to String.prototype.' + func + ' must not be a regular expression');
  }
  return thisArg + '';
};
$jscomp.polyfill('String.prototype.codePointAt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(position) {
    var string = $jscomp.checkStringArgs(this, null, 'codePointAt');
    var size = string.length;
    position = Number(position) || 0;
    if (!(position >= 0 && position < size)) {
      return void 0;
    }
    position = position | 0;
    var first = string.charCodeAt(position);
    if (first < 55296 || first > 56319 || position + 1 === size) {
      return first;
    }
    var second = string.charCodeAt(position + 1);
    if (second < 56320 || second > 57343) {
      return first;
    }
    return (first - 55296) * 1024 + second + 9216;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.endsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'endsWith');
    searchString = searchString + '';
    if (opt_position === void 0) {
      opt_position = string.length;
    }
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = searchString.length;
    while (j > 0 && i > 0) {
      if (string[--i] != searchString[--j]) {
        return false;
      }
    }
    return j <= 0;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.fromCodePoint', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
      var code = Number(arguments[i]);
      if (code < 0 || code > 1114111 || code !== Math.floor(code)) {
        throw new RangeError('invalid_code_point ' + code);
      }
      if (code <= 65535) {
        result += String.fromCharCode(code);
      } else {
        code -= 65536;
        result += String.fromCharCode(code >>> 10 & 1023 | 55296);
        result += String.fromCharCode(code & 1023 | 56320);
      }
    }
    return result;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'includes');
    return string.indexOf(searchString, opt_position || 0) !== -1;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.repeat', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(copies) {
    var string = $jscomp.checkStringArgs(this, null, 'repeat');
    if (copies < 0 || copies > 1342177279) {
      throw new RangeError('Invalid count value');
    }
    copies = copies | 0;
    var result = '';
    while (copies) {
      if (copies & 1) {
        result += string;
      }
      if (copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.stringPadding = function(padString, padLength) {
  var padding = padString !== undefined ? String(padString) : ' ';
  if (!(padLength > 0) || !padding) {
    return '';
  }
  var repeats = Math.ceil(padLength / padding.length);
  return padding.repeat(repeats).substring(0, padLength);
};
$jscomp.polyfill('String.prototype.padEnd', function(orig) {
  if (orig) {
    return orig;
  }
  var padEnd = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return string + $jscomp.stringPadding(opt_padString, padLength);
  };
  return padEnd;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.padStart', function(orig) {
  if (orig) {
    return orig;
  }
  var padStart = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return $jscomp.stringPadding(opt_padString, padLength) + string;
  };
  return padStart;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.startsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'startsWith');
    searchString = searchString + '';
    var strLen = string.length;
    var searchLen = searchString.length;
    var i = Math.max(0, Math.min((opt_position) | 0, string.length));
    var j = 0;
    while (j < searchLen && i < strLen) {
      if (string[i++] != searchString[j++]) {
        return false;
      }
    }
    return j >= searchLen;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.arrayFromIterator = function(iterator) {
  var i;
  var arr = [];
  while (!(i = iterator.next()).done) {
    arr.push(i.value);
  }
  return arr;
};
$jscomp.arrayFromIterable = function(iterable) {
  if (iterable instanceof Array) {
    return iterable;
  } else {
    return $jscomp.arrayFromIterator($jscomp.makeIterator(iterable));
  }
};
$jscomp.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  for (var p in parentCtor) {
    if (Object.defineProperties) {
      var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
      if (descriptor) {
        Object.defineProperty(childCtor, p, descriptor);
      }
    } else {
      childCtor[p] = parentCtor[p];
    }
  }
};
$jscomp.polyfill('WeakSet', function(NativeWeakSet) {
  function isConformant() {
    if (!NativeWeakSet || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var set = new (NativeWeakSet)([x]);
      if (!set.has(x) || set.has(y)) {
        return false;
      }
      set['delete'](x);
      set.add(y);
      return !set.has(x) && set.has(y);
    } catch (err) {
      return false;
    }
  }
  if (isConformant()) {
    return NativeWeakSet;
  }
  var PolyfillWeakSet = function(opt_iterable) {
    this.map_ = new WeakMap;
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
  };
  PolyfillWeakSet.prototype.add = function(elem) {
    this.map_.set(elem, true);
    return this;
  };
  PolyfillWeakSet.prototype.has = function(elem) {
    return this.map_.has(elem);
  };
  PolyfillWeakSet.prototype['delete'] = function(elem) {
    return this.map_['delete'](elem);
  };
  return PolyfillWeakSet;
}, 'es6-impl', 'es3');
try {
  if (Array.prototype.values.toString().indexOf('[native code]') == -1) {
    delete Array.prototype.values;
  }
} catch (e) {
}
Ext.define('Ext.google.ux.Client', {extend:'Ext.Mixin', mixins:['Ext.mixin.Mashup'], requiredScripts:['//apis.google.com/js/client.js?onload\x3d_ext_google_ux_client_initialize_'], statics:{getApiVersion:function(api) {
  var library = this.libraries[api];
  return library && library.state == 2 ? library.version : null;
}}, mixinConfig:{extended:function(baseClass, derivedClass, classBody) {
  this.load(classBody.googleApis);
}}, onClassMixedIn:function(cls) {
  this.load(cls.prototype.googleApis);
}, privates:{statics:{initialized:false, blocked:false, loading:0, libraries:{}, load:function(apis) {
  var libraries = this.libraries, version, library;
  if (!Ext.isObject(apis)) {
    return;
  }
  Ext.Object.each(apis, function(api, cfg) {
    version = cfg.version || 'v1';
    library = libraries[api];
    if (!Ext.isDefined(library)) {
      libraries[api] = {version:version, state:0};
    } else {
      if (library.version !== version) {
        Ext.log.error('Google API: failed to load version "' + version + '" of the', '"' + api + '" API: "' + library.version + '" already loaded.');
      }
    }
  });
  this.refresh();
}, refresh:function() {
  var me = this;
  if (!me.blocked) {
    Ext.env.Ready.block();
    me.blocked = true;
  }
  if (!me.initialized) {
    return;
  }
  Ext.Object.each(me.libraries, function(api, library) {
    if (library.state == 0) {
      library.state = 1;
      gapi.client.load(api, library.version, function() {
        library.state = 2;
        if (!--me.loading) {
          me.refresh();
        }
      });
    }
    if (library.state == 1) {
      me.loading++;
    }
  });
  if (!me.loading && me.blocked) {
    Ext.env.Ready.unblock();
    me.blocked = false;
  }
}, initialize:function() {
  this.initialized = true;
  this.refresh();
}}}});
_ext_google_ux_client_initialize_ = function() {
  gapi.auth.init(function() {
    Ext.google.ux.Client.initialize();
  });
};
Ext.define('Ext.google.data.AbstractProxy', {extend:'Ext.data.proxy.Server', mixins:['Ext.google.ux.Client'], batchActions:false, reader:{type:'json', rootProperty:'items', messageProperty:'error'}, doRequest:function(operation) {
  var me = this, request = me.buildRequest(operation), writer = me.getWriter(), error = false;
  if (writer && operation.allowWrite()) {
    request = writer.write(request);
  }
  me.execute(me.buildApiRequests(request)).then(function(response) {
    me.processApiResponse(operation, request, response);
  });
  return request;
}, buildUrl:function(request) {
  return '';
}, privates:{execute:function(requests) {
  requests = [].concat(requests);
  var results = [];
  return Ext.Array.reduce(requests, function(sequence, r) {
    return sequence.then(function() {
      return r.then(function(result) {
        results.push(result);
      });
    });
  }, Ext.Deferred.resolved()).then(function() {
    return {result:results};
  });
}, processApiResponse:function(operation, request, responses) {
  var error = false, results = [];
  Ext.each(Object.keys(responses.result), function(index) {
    var result = responses.result[index].result;
    if (result.error) {
      error = result.error.message;
      return false;
    }
    results.push(result);
  });
  this.processResponse(true, operation, request, {results:error ? [] : results, success:!error, error:error});
}, sanitizeItems:function(items) {
  var results = [], ids = [];
  Ext.Array.each(items, function(item) {
    if (!Ext.Array.contains(ids, item.id)) {
      results.push(item);
      ids.push(item.id);
    }
  }, this, true);
  return results;
}}});
Ext.define('Ext.google.data.EventsProxy', {extend:'Ext.google.data.AbstractProxy', alias:'proxy.google-events', googleApis:{'calendar':{version:'v3'}}, buildApiRequests:function(request) {
  var me = this, action = request.getAction();
  switch(action) {
    case 'read':
      return me.buildReadApiRequests(request);
    case 'create':
      return me.buildCreateApiRequests(request);
    case 'update':
      return me.buildUpdateApiRequests(request);
    case 'destroy':
      return me.buildDestroyApiRequests(request);
    default:
      Ext.raise('unsupported request: events.' + action);
      return null;
  }
}, extractResponseData:function(response) {
  var me = this, data = me.callParent(arguments), items = [];
  Ext.each(data.results, function(result) {
    switch(result.kind) {
      case 'calendar#events':
        items = items.concat(result.items.map(me.fromApiEvent.bind(me)));
        break;
      case 'calendar#event':
        items.push(me.fromApiEvent(result));
        break;
      default:
        break;
    }
  });
  return {items:me.sanitizeItems(items), success:data.success, error:data.error};
}, privates:{toApiEvent:function(data, allDay) {
  var res = {};
  Ext.Object.each(data, function(key, value) {
    var dateTime = null, date = null;
    switch(key) {
      case 'calendarId':
      case 'description':
        res[key] = value;
        break;
      case 'id':
        res.eventId = value;
        break;
      case 'title':
        res.summary = value;
        break;
      case 'startDate':
      case 'endDate':
        if (allDay) {
          date = new Date(value);
          date.setHours(0, -date.getTimezoneOffset());
          date = Ext.Date.format(date, 'Y-m-d');
        } else {
          dateTime = Ext.Date.format(new Date(value), 'c');
        }
        res[key.slice(0, -4)] = {date:date, dateTime:dateTime};
        break;
      default:
        break;
    }
  });
  return res;
}, fromApiEvent:function(data) {
  var res = {allDay:true};
  Ext.Object.each(data, function(key, value) {
    var date, offset, allDay;
    switch(key) {
      case 'id':
      case 'description':
        res[key] = value;
        break;
      case 'summary':
        res.title = value;
        break;
      case 'start':
      case 'end':
        date = Ext.Date.parse(value.dateTime || value.date, 'C');
        offset = date.getTimezoneOffset();
        allDay = !!value.date;
        if (allDay && offset !== 0) {
          date.setHours(0, -offset);
        }
        res[key + 'Date'] = date;
        res.allDay = res.allDay && allDay;
        break;
      default:
        break;
    }
  });
  return res;
}, buildReadApiRequests:function(request) {
  var rparams = request.getParams(), start = new Date(rparams.startDate), end = new Date(rparams.endDate), requests = [], next;
  while (start < end) {
    next = Ext.Date.add(start, Ext.Date.MONTH, 3);
    if (next > end) {
      next = end;
    }
    requests.push(gapi.client.calendar.events.list({calendarId:rparams.calendar, timeMin:Ext.Date.format(start, 'C'), timeMax:Ext.Date.format(next, 'C'), singleEvents:true, maxResults:2500}));
    start = next;
  }
  return requests;
}, buildCreateApiRequests:function(request) {
  var record = request.getRecords()[0];
  return gapi.client.calendar.events.insert(this.toApiEvent(request.getJsonData(), record.get('allDay')));
}, buildUpdateApiRequests:function(request) {
  var record = request.getRecords()[0], params = this.toApiEvent(request.getJsonData(), record.get('allDay')), prevCalendarId = record.getModified('calendarId'), currCalendarId = record.get('calendarId'), eventId = record.getId(), requests = [];
  params.calendarId = currCalendarId;
  params.eventId = eventId;
  if (prevCalendarId && prevCalendarId !== currCalendarId) {
    requests.push(gapi.client.calendar.events.move({destination:currCalendarId, calendarId:prevCalendarId, eventId:eventId}));
  }
  if (Object.keys(params).length > 2) {
    requests.push(gapi.client.calendar.events.patch(params));
  }
  return requests;
}, buildDestroyApiRequests:function(request) {
  var record = request.getRecords()[0];
  data = request.getJsonData();
  data.calendarId = data.calendarId || record.get('calendarId') || record.getPrevious('calendarId');
  return gapi.client.calendar.events['delete']({'calendarId':data.calendarId, 'eventId':data.id});
}}});
Ext.define('Ext.google.data.CalendarsProxy', {extend:'Ext.google.data.AbstractProxy', alias:'proxy.google-calendars', requires:['Ext.google.data.EventsProxy'], googleApis:{'calendar':{version:'v3'}}, buildApiRequests:function(request) {
  var me = this, action = request.getAction();
  switch(action) {
    case 'read':
      return me.buildReadApiRequests(request);
    case 'update':
      return me.buildUpdateApiRequests(request);
    default:
      Ext.raise('unsupported request: calendars.' + action);
      return null;
  }
}, extractResponseData:function(response) {
  var me = this, data = me.callParent(arguments), items = [];
  Ext.each(data.results, function(result) {
    switch(result.kind) {
      case 'calendar#calendarList':
        items = items.concat(result.items.map(me.fromApiCalendar.bind(me)));
        break;
      default:
        break;
    }
  });
  return {items:me.sanitizeItems(items), success:data.success, error:data.error};
}, privates:{toApiCalendar:function(data) {
  var res = {};
  Ext.Object.each(data, function(key, value) {
    switch(key) {
      case 'id':
        res.calendarId = value;
        break;
      case 'hidden':
        res.selected = !value;
        break;
      default:
        break;
    }
  });
  return res;
}, fromApiCalendar:function(data) {
  var record = {hidden:!data.selected, editable:false, eventStore:{autoSync:true, proxy:{type:'google-events', resourceTypes:'events'}}};
  Ext.Object.each(data, function(key, value) {
    switch(key) {
      case 'id':
      case 'description':
        record[key] = value;
        break;
      case 'backgroundColor':
        record.color = value;
        break;
      case 'summary':
        record.title = value;
        break;
      case 'accessRole':
        record.editable = value == 'owner' || value == 'writer';
        break;
      default:
        break;
    }
  });
  return record;
}, buildReadApiRequests:function(request) {
  return gapi.client.calendar.calendarList.list();
}, buildUpdateApiRequests:function(request) {
  var data = this.toApiCalendar(request.getJsonData());
  return gapi.client.calendar.calendarList.patch(data);
}}});
Ext.define('Ext.ux.google.Api', {mixins:['Ext.mixin.Mashup'], requiredScripts:['//www.google.com/jsapi'], statics:{loadedModules:{}}, onClassExtended:function(cls, data, hooks) {
  var onBeforeClassCreated = hooks.onBeforeCreated, Api = this;
  hooks.onBeforeCreated = function(cls, data) {
    var me = this, apis = [], requiresGoogle = Ext.Array.from(data.requiresGoogle), loadedModules = Api.loadedModules, remaining = 0, callback = function() {
      if (!--remaining) {
        onBeforeClassCreated.call(me, cls, data, hooks);
      }
      Ext.env.Ready.unblock();
    }, api, i, length;
    length = requiresGoogle.length;
    for (i = 0; i < length; ++i) {
      if (Ext.isString(api = requiresGoogle[i])) {
        apis.push({api:api});
      } else {
        if (Ext.isObject(api)) {
          apis.push(Ext.apply({}, api));
        }
      }
    }
    Ext.each(apis, function(api) {
      var name = api.api, version = String(api.version || '1.x'), module = loadedModules[name];
      if (!module) {
        ++remaining;
        Ext.env.Ready.block();
        loadedModules[name] = module = [callback].concat(api.callback || []);
        delete api.api;
        delete api.version;
        if (!window.google) {
          Ext.raise("'google' is not defined.");
          return false;
        }
        google.load(name, version, Ext.applyIf({callback:function() {
          loadedModules[name] = true;
          for (var n = module.length; n-- > 0;) {
            module[n]();
          }
        }}, api));
      } else {
        if (module !== true) {
          module.push(callback);
        }
      }
    });
    if (!remaining) {
      onBeforeClassCreated.call(me, cls, data, hooks);
    }
  };
}});
Ext.define('Ext.ux.google.Map', {extend:'Ext.Container', xtype:['map', 'google-map'], alternateClassName:'Ext.Map', requires:['Ext.util.Geolocation'], mixins:['Ext.mixin.Mashup'], requires:['Ext.data.StoreManager'], requiredScripts:['//maps.googleapis.com/maps/api/js{options}'], isMap:true, config:{useCurrentLocation:false, map:null, geo:null, mapOptions:{}, mapListeners:null, markers:null, markerTemplate:{title:'{title}', position:'{position}', animation:'{animation}', clickable:'{clickable}', draggable:'{draggable}', 
visible:'{visible}'}}, baseCls:Ext.baseCSSPrefix + 'map', constructor:function(config) {
  this.callParent([config]);
  if (!(window.google || {}).maps) {
    this.setHtml('Google Maps API is required');
  }
}, initialize:function() {
  this.callParent();
  this.initMap();
  this.on({painted:'onPainted', scope:this});
  this.bodyElement.on('touchstart', 'onTouchStart', this);
}, initMap:function() {
  var map = this.getMap();
  if (!map) {
    var gm = (window.google || {}).maps;
    if (!gm) {
      return null;
    }
    var element = this.mapContainer, mapOptions = this.getMapOptions(), event = gm.event, me = this;
    if (element.dom.firstChild) {
      Ext.fly(element.dom.firstChild).destroy();
    }
    if (Ext.os.is.iPad) {
      Ext.merge({navigationControlOptions:{style:gm.NavigationControlStyle.ZOOM_PAN}}, mapOptions);
    }
    mapOptions.mapTypeId = mapOptions.mapTypeId || gm.MapTypeId.ROADMAP;
    mapOptions.center = mapOptions.center || new gm.LatLng(37.381592, -122.135672);
    if (mapOptions.center && mapOptions.center.latitude && !Ext.isFunction(mapOptions.center.lat)) {
      mapOptions.center = new gm.LatLng(mapOptions.center.latitude, mapOptions.center.longitude);
    }
    mapOptions.zoom = mapOptions.zoom || 12;
    map = new gm.Map(element.dom, mapOptions);
    this.setMap(map);
    event.addListener(map, 'zoom_changed', Ext.bind(me.onZoomChange, me));
    event.addListener(map, 'maptypeid_changed', Ext.bind(me.onTypeChange, me));
    event.addListener(map, 'center_changed', Ext.bind(me.onCenterChange, me));
    event.addListenerOnce(map, 'tilesloaded', Ext.bind(me.onTilesLoaded, me));
    this.addMapListeners();
  }
  return this.getMap();
}, renderMap:function() {
  this.initMap();
}, getElementConfig:function() {
  return {reference:'element', className:'x-container', children:[{reference:'bodyElement', className:'x-inner', children:[{reference:'mapContainer', className:Ext.baseCSSPrefix + 'map-container'}]}]};
}, onTouchStart:function(e) {
  e.makeUnpreventable();
}, updateMap:function(map) {
  var markers = this.getMarkers();
  if (markers) {
    markers.each(function(record) {
      var marker = this.getMarkerForRecord(record);
      if (marker) {
        marker.setMap(map);
      }
    }, this);
  }
}, applyMapOptions:function(options) {
  return Ext.merge({}, this.options, options);
}, updateMapOptions:function(newOptions) {
  var gm = (window.google || {}).maps, map = this.getMap();
  if (gm && map) {
    map.setOptions(newOptions);
  }
}, applyMarkers:function(value) {
  if (!value) {
    return null;
  }
  if (value.isStore) {
    return value;
  }
  if (Ext.isArray(value)) {
    value = {data:value};
  } else {
    if (Ext.isObject(value)) {
      value = {data:[value]};
    }
  }
  return Ext.getStore(value);
}, updateMarkers:function(curr, prev) {
  var me = this, listeners = {add:'onMarkersAdd', remove:'onMarkersRemove', itemchange:'onMarkerChange', scope:this};
  if (prev && prev.isStore) {
    prev.getData().un(listeners);
    me.removeMarkers(prev.getRange());
  }
  if (curr && curr.isStore) {
    me.addMarkers(curr.getRange());
    curr.getData().on(listeners);
  }
}, applyMarkerTemplate:function(value) {
  return Ext.util.ObjectTemplate.create(value);
}, updateMarkerTemplate:function(value) {
  var markers = this.getMarkers();
  if (markers) {
    this.refreshMarkers(markers.getRange());
  }
}, doMapCenter:function() {
  this.setMapCenter(this.getMapOptions().center);
}, getMapOptions:function() {
  return Ext.merge({}, this.options || this.getInitialConfig('mapOptions'));
}, updateUseCurrentLocation:function(useCurrentLocation) {
  this.setGeo(useCurrentLocation);
  if (!useCurrentLocation) {
    this.setMapCenter();
  }
}, applyGeo:function(config) {
  return Ext.factory(config, Ext.util.Geolocation, this.getGeo());
}, updateGeo:function(newGeo, oldGeo) {
  var events = {locationupdate:'onGeoUpdate', locationerror:'onGeoError', scope:this};
  if (oldGeo) {
    oldGeo.un(events);
  }
  if (newGeo) {
    newGeo.on(events);
    newGeo.updateLocation();
  }
}, onPainted:function() {
  var gm = (window.google || {}).maps, map = this.getMap(), center;
  if (gm && map) {
    center = map.getCenter();
    gm.event.trigger(map, 'resize');
    if (center) {
      map.setCenter(center);
    }
  }
}, onTilesLoaded:function() {
  this.fireEvent('maprender', this, this.getMap());
}, addMapListeners:function() {
  var gm = (window.google || {}).maps, map = this.getMap(), mapListeners = this.getMapListeners();
  if (gm) {
    var event = gm.event, me = this, listener, scope, fn, callbackFn, handle;
    if (Ext.isSimpleObject(mapListeners)) {
      for (var eventType in mapListeners) {
        listener = mapListeners[eventType];
        if (Ext.isSimpleObject(listener)) {
          scope = listener.scope;
          fn = listener.fn;
        } else {
          if (Ext.isFunction(listener)) {
            scope = null;
            fn = listener;
          }
        }
        if (fn) {
          callbackFn = function() {
            this.fn.apply(this.scope, [me]);
            if (this.handle) {
              event.removeListener(this.handle);
              delete this.handle;
              delete this.fn;
              delete this.scope;
            }
          };
          handle = event.addListener(map, eventType, Ext.bind(callbackFn, callbackFn));
          callbackFn.fn = fn;
          callbackFn.scope = scope;
          if (listener.single === true) {
            callbackFn.handle = handle;
          }
        }
      }
    }
  }
}, onGeoUpdate:function(geo) {
  if (geo) {
    this.setMapCenter(new google.maps.LatLng(geo.getLatitude(), geo.getLongitude()));
  }
}, onGeoError:Ext.emptyFn, setMapCenter:function(coordinates) {
  var me = this, map = me.getMap(), mapOptions = me.getMapOptions(), gm = (window.google || {}).maps, marker;
  if (gm) {
    if (!coordinates) {
      if (map && map.getCenter) {
        coordinates = map.getCenter();
      } else {
        if (mapOptions.hasOwnProperty('center')) {
          coordinates = mapOptions.center;
        } else {
          coordinates = new gm.LatLng(37.381592, -122.135672);
        }
      }
    } else {
      if (coordinates.isModel) {
        var marker = me.getMarkerForRecord(coordinates);
        coordinates = marker && marker.position;
      }
    }
    if (coordinates && !(coordinates instanceof gm.LatLng) && 'longitude' in coordinates) {
      coordinates = new gm.LatLng(coordinates.latitude, coordinates.longitude);
    }
    if (!map) {
      mapOptions.center = mapOptions.center || coordinates;
      me.renderMap();
      map = me.getMap();
    }
    if (map && coordinates instanceof gm.LatLng) {
      map.panTo(coordinates);
    } else {
      this.options = Ext.apply(this.getMapOptions(), {center:coordinates});
    }
  }
}, fitMarkersInView:function(records) {
  var me = this, map = me.getMap(), b2 = map.getBounds(), markers = me.getMarkers(), gm = (window.google || {}).maps, b1, b1ne, b1sw, b2ne, b2sw;
  if (!map || !b2 || !markers) {
    return;
  }
  if (Ext.isEmpty(records)) {
    records = markers.getRange();
    if (Ext.isEmpty(records)) {
      return;
    }
  }
  b1 = new gm.LatLngBounds;
  Ext.each(records, function(record) {
    var marker = me.getMarkerForRecord(record);
    if (marker) {
      b1.extend(marker.getPosition());
    }
  });
  b1ne = b1.getNorthEast();
  b1sw = b1.getSouthWest();
  b2ne = b2.getNorthEast();
  b2sw = b2.getSouthWest();
  if (b1ne.lat() - b1sw.lat() > b2ne.lat() - b2sw.lat() || b1ne.lng() - b1sw.lng() > b2ne.lng() - b2sw.lng()) {
    map.fitBounds(b1);
  } else {
    map.panToBounds(b1);
  }
}, onZoomChange:function() {
  var mapOptions = this.getMapOptions(), map = this.getMap(), zoom;
  zoom = map && map.getZoom ? map.getZoom() : mapOptions.zoom || 10;
  this.options = Ext.apply(mapOptions, {zoom:zoom});
  this.fireEvent('zoomchange', this, map, zoom);
}, onTypeChange:function() {
  var mapOptions = this.getMapOptions(), map = this.getMap(), mapTypeId;
  mapTypeId = map && map.getMapTypeId ? map.getMapTypeId() : mapOptions.mapTypeId;
  this.options = Ext.apply(mapOptions, {mapTypeId:mapTypeId});
  this.fireEvent('typechange', this, map, mapTypeId);
}, onCenterChange:function() {
  var mapOptions = this.getMapOptions(), map = this.getMap(), center;
  center = map && map.getCenter ? map.getCenter() : mapOptions.center;
  this.options = Ext.apply(mapOptions, {center:center});
  this.fireEvent('centerchange', this, map, center);
}, doDestroy:function() {
  Ext.destroy(this.getGeo());
  var map = this.getMap();
  if (map && (window.google || {}).maps) {
    google.maps.event.clearInstanceListeners(map);
  }
  this.callParent();
}, privates:{markerEvents:['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'rightclick'], getMarkerForRecord:function(record) {
  var expando = record && Ext.getExpando(record, this.getId());
  return expando && expando.marker || null;
}, buildMarkerOptions:function(record, tpl) {
  var options = tpl.apply(record.getData(true)), gm = (window.google || {}).maps, animation = options.animation;
  if (typeof animation === 'string') {
    options.animation = gm.Animation[animation] || null;
  }
  return options;
}, addMarkers:function(records) {
  var me = this, eid = me.getId(), map = me.getMap(), tpl = me.getMarkerTemplate(), gm = (window.google || {}).maps, store = me.getMarkers(), events = me.markerEvents;
  Ext.each(records, function(record) {
    var index = store.indexOf(record), options = me.buildMarkerOptions(record, tpl), marker = new gm.Marker(Ext.apply(options, {map:map})), listeners = events.map(function(type) {
      return marker.addListener(type, function(event) {
        me.fireEvent('marker' + type, me, {index:index, record:record, marker:marker, event:event});
      });
    });
    Ext.setExpando(record, eid, {listeners:listeners, marker:marker});
  });
}, removeMarkers:function(records) {
  var eid = this.getId();
  Ext.each(records, function(record) {
    var expando = Ext.getExpando(record, eid), marker = expando && expando.marker;
    if (marker) {
      marker.setMap(null);
      Ext.each(expando.listeners || [], function(listener) {
        listener.remove();
      });
    }
    Ext.setExpando(record, eid, undefined);
  });
}, refreshMarkers:function(records) {
  var me = this, tpl = me.getMarkerTemplate(), count = records.length, record, marker, i;
  for (i = 0; i < count; ++i) {
    record = records[i];
    marker = me.getMarkerForRecord(record);
    if (marker) {
      marker.setOptions(me.buildMarkerOptions(record, tpl));
    }
  }
}, onMarkersAdd:function(collection, details) {
  this.addMarkers(details.items);
}, onMarkersRemove:function(collection, details) {
  this.removeMarkers(details.items);
}, onMarkerChange:function(collection, details) {
  this.refreshMarkers([details.item]);
}}});
Ext.define('Ext.ux.google.map.Marker', {extend:'Ext.data.Model', fields:[{name:'position', type:'auto'}, {name:'title', type:'string', defaultValue:null}, {name:'animation', type:'number', defaultValue:'DROP', persist:false}, {name:'clickable', type:'boolean', defaultValue:true, persist:false}, {name:'draggable', type:'boolean', defaultValue:false, persist:false}, {name:'visible', type:'boolean', defaultValue:true, persist:false}]});
