angular.module('BlurAdmin.data.adapters').factory(
  'UserAdapter',
  function(backendProtocol, backendHost, backendPath) {

    var options = {
      basePath: backendProtocol + '://' + backendHost + backendPath + '/',
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
