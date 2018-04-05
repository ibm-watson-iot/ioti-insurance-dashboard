
(function() {

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

      function wrapPromise(_this, promise, rel, value) {
        promise.value = value;
        promise.reload = function() {
          _this[META].loaded[rel] = false;
          return _this[rel];
        };
        promise.clear = function() {
          _this[META].loaded[rel] = false;
        };
        return promise;
      }

      return JSData.Record.extend({
        save(opts) {
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
            value: { loaded: {} }
          });
          var _this = this;
          relations.forEach(function(rel) {
            Object.defineProperty(_this, rel, {
              get() {
                var value = _this['__' + rel];
                var promise = Promise.resolve(value);
                promise = wrapPromise(_this, promise, rel, value);
                if (_this[META].loaded[rel]) {
                  return promise;
                }
                if (Array.isArray(value) && value.length > 0) {
                  return promise;
                }
                if (!Array.isArray(value) && value && Object.keys(value).length > 0) {
                  return promise;
                }
                promise = _this.loadRelations(['__' + rel]).then(function(record) {
                  _this[META].loaded[rel] = true;
                  wrapPromise(_this, promise, rel, record['__' + rel]);
                  return record['__' + rel];
                });
                return promise;
              },
              set(val) {
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
