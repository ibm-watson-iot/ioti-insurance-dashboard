angular.module('BlurAdmin').factory('ApplicationAdapter', function (
  DSHttpAdapter, backendProtocol, backendHost, backendPath, authenticationService
) {

  const options = {
    basePath: backendProtocol + '://' + backendHost + backendPath + '/',
    beforeHTTP: function (config, opts) {
      config.headers || (config.headers = {});
      config.headers.authorization = "Bearer" + authenticationService.getToken();

      // Now do the default behavior
      return HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
    },
    deserialize: function (mapper, response, opts) {
      if (response.data.items) {
        response = response.data.items;
      }
      // Else, do default behavior
      return HttpAdapter.prototype.deserialize.call(this, mapper, response, opts);
    }
  };

// pass options to the constructor
  return new DSHttpAdapter(options);
});