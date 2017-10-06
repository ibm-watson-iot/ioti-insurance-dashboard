'use strict';

angular.module('BlurAdmin.services').factory('claimService', function(
  BaseService, backendProtocol, backendHost, backendPath) {

  var backendUrl = backendProtocol + '://' + backendHost + backendPath + '/';

  var service = new BaseService('claims', backendUrl);
  var oldFindAll = service.findAll;
  service.findAll = function (queryParams) {
    queryParams = queryParams || {};
    queryParams.userId = queryParams.userId || 'all';
    return oldFindAll.apply(this, queryParams);
  };
  return service;
});
