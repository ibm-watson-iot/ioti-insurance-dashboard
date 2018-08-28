angular.module('BlurAdmin.data.adapters').factory(
  'ApplicationAdapter',
  function(apiProtocol, apiHost, apiPath, tenantId, authenticationService, $location, toastr) {

    var options = {
      basePath: apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/',
      beforeHTTP: function(config, opts) {
        config.headers || (config.headers = {});
        config.headers.authorization = 'Bearer ' + authenticationService.getToken();

        var model = config.data,
          hasFile = false,
          fd = new FormData();
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
      },

      afterUpdate: function(mapper, id, props, opts) {
        toastr.success('Updated ' + mapper.name + ' - ' + id + ' successfully');
      },

      afterCreate: function(mapper, id, props, opts) {
        toastr.success('Created ' + mapper.name + ' - ' + id + ' successfully');
      },

      afterDestroy: function(mapper, id, props, opts) {
        toastr.success('Deleted ' + mapper.name + ' - ' + id + ' successfully');
      },

      error: function(err, data) {
        var isAPICall, originalPath, tokenKey, method, id;

        console.error(
          'Failed to ' + data.config.method + ' ' + data.config.name,
          data.request.message,
          data.response && data.response.data
        );

        if ((!data.response || data.response.status !== 401) && !data.config.noToast) {
          id = data.config.url.split(data.config.endpoint + '/')[1];
          method = data.config.method;
          if (method === 'post') {
            method = 'create';
            if (id) {
              method = 'update';
            }
          }
          if (method === 'put') {
            method = 'replace';
          }
          if (id) {
            toastr.error('Failed to ' + data.config.method + ' ' + data.config.name + ' - ' + id);
          } else {
            toastr.error('Failed to ' + data.config.method + ' ' + data.config.endpoint);
          }

        }

        if (data.response && data.response.status === 401) {
          tokenKey = $location.host() + '_' + $location.port() + '_dashboardAuthToken';
          isAPICall = data.config.url.indexOf(apiHost) > 0;
          if (isAPICall && (data.response.status === 401)) {
            originalPath = $location.path();
            if (originalPath !== '/signin') {
              alert('Session timed out. Please sign in again');
              localStorage.removeItem(tokenKey);
              $location.path('/signin');
            }
          }
        }
      }
    };

    // pass options to the constructor
    var adapter = new JSDataHttp.HttpAdapter(options);
    adapter.__options = options;
    return adapter;
  }
);
