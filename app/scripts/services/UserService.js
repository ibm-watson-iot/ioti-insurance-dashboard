'use strict';

angular.module('BlurAdmin.services').factory('userService', function(
  $http, backendProtocol, backendHost, backendPath, BaseService) {

  var backendUrl = backendProtocol + '://' + backendHost + backendPath + '/';
  var userService = new BaseService('users', backendUrl);
  var oldFindAll = userService.findAll;
  userService.findAll = function (queryParams) {
    queryParams = queryParams || {};
    queryParams.userId = queryParams.userId || 'all';
    return oldFindAll.apply(this, queryParams);
  };
  return userService;
});
