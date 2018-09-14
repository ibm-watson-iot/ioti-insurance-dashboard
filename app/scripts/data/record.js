
(function() {

  var TTLCache = function() {
    this.cache = {};
  };

  TTLCache.prototype = {
    set: function(key, val, ttl) {
      this.cache[key] = {
        ttl: Date.now() + ((ttl || 30) * 1000),
        val: val
      };
    },
    get: function(key) {
      if (this.cache[key] && this.cache[key].ttl > Date.now()) {
        return this.cache[key].val;
      } else {
        delete this.cache[key];
        return null;
      }
    }
  };

  var globalFailedCache = new TTLCache();

  angular.module('BlurAdmin.data.record').factory('createRecordClass', function(uuid4) {
    return function createRecordClass(model) {
      var META = uuid4.generate();
      var relations = [];
      Object.keys(model.relations.belongsTo || {}).forEach(function(k) {
        var localField = model.relations.belongsTo[k].localField;
        model.relations.belongsTo[k].localField = '__' + localField;
        relations.push(localField);
      });
      Object.keys(model.relations.hasMany || {}).forEach(function(k) {
        var localField = model.relations.hasMany[k].localField;
        model.relations.hasMany[k].localField = '__' + localField;
        relations.push(localField);
      });
      Object.keys(model.relations.hasOne || {}).forEach(function(k) {
        var localField = model.relations.hasOne[k].localField;
        model.relations.hasOne[k].localField = '__' + localField;
        relations.push(localField);
      });

      function wrapPromise(_this, promise, rel, value) {
        promise.value = value;
        promise.reload = function() {
          _this[META].loaded[rel] = false;
          _this[META].reload[rel] = true;
          return _this[rel];
        };
        promise.clear = function() {
          _this[META].loaded[rel] = false;
          _this[META].reload[rel] = true;
        };
        return promise;
      }

      return JSData.Record.extend({
        save: function(opts) {
          opts = opts || {};
          if (opts.changesOnly === undefined) {
            opts.changesOnly = true;
          }
          return JSData.Record.prototype.save.call(this, opts);
        },
        constructor: function(props, opts) {
          JSData.Record.call(this, props, opts);
          Object.defineProperty(this, META, {
            enumerable: false,
            value: { loaded: {}, reload: {} }
          });
          var _this = this;
          relations.forEach(function(rel) {
            Object.defineProperty(_this, rel, {
              get: function() {
                var id, key, loadedKey, failedPromise, value, promise;
                key = this._mapper().relationList.find(function(r) {
                  return r.localField === '__' + rel;
                }).localKey;
                loadedKey = rel;
                if (key !== undefined) {
                  id = _this[key];
                  loadedKey = key + '-' + id;
                }
                failedPromise = globalFailedCache.get(rel + ':' + id);
                if (failedPromise) {
                  wrapPromise(_this, failedPromise, rel, null);
                  return failedPromise;
                }

                value = _this['__' + rel];
                promise = Promise.resolve(value);
                promise = wrapPromise(_this, promise, rel, value);
                if (!_this[META].reload[loadedKey]) {
                  if (_this[META].loaded[loadedKey]) {
                    return _this[META].loaded[loadedKey];
                  }
                  if (Array.isArray(value) && value.length > 0) {
                    return promise;
                  }
                  if (!Array.isArray(value) && value && Object.keys(value).length > 0) {
                    return promise;
                  }
                }
                promise = _this.loadRelations(['__' + rel]).then(function(record) {
                  _this[META].loaded[loadedKey] = promise;
                  _this[META].reload[loadedKey] = false;
                  wrapPromise(_this, promise, rel, record['__' + rel]);
                  return record['__' + rel];
                });
                promise.catch(function(err) {
                  if (key && (err.request.status >= 400 || !err.response)) {
                    globalFailedCache.set(rel + ':' + id, promise);
                  }
                });
                return promise;
              },
              set: function(val) {
                if (val.then) {
                  if (val.value) {
                    _this['__' + rel] = val.value;
                    return;
                  }
                  val.then(function(v) {
                    _this['__' + rel] = v;
                  });
                  return;
                }
                _this['__' + rel] = val;
              }
            });
          });
        }
      });
    };
  });
}());
