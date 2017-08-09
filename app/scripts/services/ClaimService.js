'use strict';

angular.module('BlurAdmin.services').factory('claimService', function(
  BaseService, backendProtocol, backendHost, backendPath) {

  var backendUrl = backendProtocol + '://' + backendHost + backendPath + '/';
  return new BaseService('claims', backendUrl);
});
