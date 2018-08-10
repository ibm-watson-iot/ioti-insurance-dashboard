angular.module('BlurAdmin.data.adapters').factory(
  'ApplicationAdapter',
  function(apiProtocol, apiHost, apiPath, tenantId, authenticationService) {

    var options = {
      basePath: apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/',
      beforeHTTP: function(config, opts) {
        config.headers || (config.headers = {});
        config.headers.authorization = 'Bearer ' + authenticationService.getToken();

        var model = config.data;
        var hasFile = false;
        var fd = new FormData();
        for (var key in model) {
          if (model.hasOwnProperty(key)) {
            if (model[key] instanceof Object && !(model[key] instanceof File || model[key] instanceof FileReader)) {
              fd.append(key, JSON.stringify(model[key]));
              continue;
            }
            if (model[key] instanceof File || model[key] instanceof FileReader) {
              hasFile = true;
            }
            fd.append(key, model[key]);
          }
        }
        if (hasFile) {
          config.data = fd;
          config.headers['Content-Type'] = undefined;
        }


        // Now do the default behavior
        return JSDataHttp.HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
      },

      deserialize: function(mapper, response, opts) {
        if (response.data.items) {
          response.meta = response.data;
          response = response.data.items;
        }
        // Else, do default behavior
        return JSDataHttp.HttpAdapter.prototype.deserialize.call(this, mapper, response, opts);
      },

      beforeUpdate: function(mapper, id, props, opts) {
        opts.method = 'post';
      },
      beforeUpdateAll: function(mapper, id, props, opts) {
        opts.method = 'post';
      },
      beforeUpdateMany: function(mapper, id, props, opts) {
        opts.method = 'post';
      },
      findAll: function(mapper, query, opts) {
        if (query.where && query.where._id && query.where._id.in !== undefined) {
          var promises = query.where._id.in.map(function(id) {
            return this.find(mapper, id, opts);
          });
          return Promise.all(promises).then(function(items) {
            return items.map(function(i) { return i.data; });
          });
        }
        return JSDataHttp.HttpAdapter.prototype.findAll.call(this, mapper, query, opts);
      }
    };

    // pass options to the constructor
    return new JSDataHttp.HttpAdapter(options);
  }
);
