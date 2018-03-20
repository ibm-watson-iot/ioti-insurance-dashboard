angular.module('BlurAdmin').factory('ApplicationAdapter', function (
  DSHttpAdapter, backendProtocol, backendHost, apiPath, tenantId, authenticationService
) {

  const options = {
    basePath: apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/',
    beforeHTTP: function (config, opts) {
      config.headers || (config.headers = {});
      config.headers.authorization = "Bearer" + authenticationService.getToken();

      // Now do the default behavior
      return HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
    },
    deserialize: function (mapper, response, opts) {
      if (response.data.items) {
        var token = response.data;
        localStorage.setItem(tokenKey, token.access_token);
        var authenticatedUser = jwtHelper.decodeToken(token.access_token);
        localStorage.setItem(userKey, JSON.stringify(authenticatedUser));
      }
      // Else, do default behavior
      return HttpAdapter.prototype.deserialize.call(this, mapper, response, opts);
    }
  };

// pass options to the constructor
  return new DSHttpAdapter(options);
});