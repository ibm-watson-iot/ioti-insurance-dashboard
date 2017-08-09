'use strict';

angular.module('BlurAdmin.services').factory('userService', function(
  $http, backendProtocol, backendHost, backendPath, BaseService) {

  var backendUrl = backendProtocol + '://' + backendHost + backendPath + '/';
  return new BaseService('users', backendUrl);
});
