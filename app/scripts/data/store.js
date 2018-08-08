(function() {

  var models = [
    'Action',
    'Device',
    'Hazard',
    'Shield',
    'ShieldActivation',
    'ShieldCode',
    'User',
    'Claim',
    'CommonShieldCode'
  ];
  var adapters = ['ApplicationAdapter', 'UserAdapter', 'ClaimAdapter'];
  var deps;
  deps = models.concat(adapters);
  deps.push('createRecordClass', '$rootScope');
  deps.push(function() {
    var CustomDataStore, adaptersMap;
    var args = Array.prototype.slice.call(arguments);
    var modelDefs = args.slice(0, models.length);
    var adaptersDefs = args.slice(models.length);
    var createRecordClass = args.slice(-2)[0];
    var $rootScope = args.slice(-1)[0];

    adaptersMap = {};
    adaptersDefs.forEach(function(adapter, i) {
      var name = _.kebabCase(adapters[i]).split('-')[0];
      adaptersMap[name] = adapter;
    });

    function runApply() {
      setTimeout(function() {
        $rootScope.$apply();
      });
    }

    var hookFunctionsForApply = [
      'create',
      'createMany',
      'destroy',
      'destroyAll',
      'update',
      'find',
      'updateAll',
      'updateMany'
    ];

    CustomDataStore = {
      __cached: {},

      getLiveArray: function(name) {
        if (this.__cached[name]) {
          return this.__cached[name];
        }
        var arr;
        arr = [];
        this.__cached[name] = arr;
        var collection = this.getCollection(name);
        function recalc() {
          arr.splice(0, arr.length);
          Array.prototype.push.apply(arr, collection.getAll());
          runApply();
        }
        collection.on('remove', recalc);
        collection.on('add', recalc);
        recalc();
        return arr;
      },

      findAll: function(name, query, opts) {
        opts = opts || {};
        var raw = opts.raw;
        // TODO disble force=true when we get operational notifications
        // opts.force = true;
        opts.raw = true;
        var _this = this;
        return JSData.DataStore.prototype.findAll.call(this, name, query, opts)
          .then(function(resp) {
            if (raw) {
              resp.data.items = _this.getLiveArray(name);
              resp.meta.items = _this.getLiveArray(name);
              return resp;
            }
            runApply();
            if (Object.keys(query || {}).length === 0) {
              return _this.getLiveArray(name);
            }
            return resp.data;
          });
      },

      cacheFind: function cacheFind(name, data, id, opts) {
        const date = Date.now();
        this._completedQueries[name][id] = function(_name, _id, _opts) {
          if (Date.now() > date + (30 * 1000)) {
            return null;
          }
          if (!_opts.raw) {
            return data.data;
          }
          return data;
        };
      },

      cacheFindAll: function cacheFindAll(name, data, hash, opts) {
        const date = Date.now();
        this._completedQueries[name][hash] = function(_name, _hash, _opts) {
          if (Date.now() > date + (30 * 1000)) {
            return null;
          }
          if (!_opts.raw) {
            return data.data;
          }
          return data;
        };
      }
    };

    hookFunctionsForApply.forEach(function(hook) {
      CustomDataStore[hook] = function() {
        var _args = Array.prototype.slice.call(arguments);
        return JSData.DataStore.prototype[hook].apply(this, _args)
          .then(function(value) {
            runApply();
            return value;
          });
      };
    });

    CustomDataStore = JSData.DataStore.extend(CustomDataStore);

    var store = new CustomDataStore();

    modelDefs.forEach(function(mod, i) {
      var name, mapper;
      name = _.kebabCase(models[i]);
      mod.endpoint = name + 's';
      mod.idAttribute = '_id';
      mod.recordClass = createRecordClass(mod);
      if (adaptersMap[name]) {
        mod.adapter = 'http-' + name;
      } else {
        mod.adapter = 'http';
      }
      mapper = store.defineMapper(name, mod);
      if (adaptersMap[name]) {
        mapper.registerAdapter('http-' + name, adaptersMap[name], { default: true });
      } else {
        mapper.registerAdapter('http', adaptersMap.application, { default: true });
      }
    });

    return store;
  });
  angular.module('BlurAdmin.data', ['BlurAdmin.data.record', 'BlurAdmin.data.models', 'BlurAdmin.data.adapters']).service('Store', deps);
}());
