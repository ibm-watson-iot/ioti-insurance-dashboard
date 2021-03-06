angular.module('BlurAdmin.data.adapters').factory(
  'UserAdapter',
  function(backendProtocol, backendHost, backendPath, ApplicationAdapter) {

    var options = ApplicationAdapter.__options;
    options.basePath = backendProtocol + '://' + backendHost + backendPath + '/';
    // pass options to the constructor
    return new JSDataHttp.HttpAdapter(options);
  }
);
