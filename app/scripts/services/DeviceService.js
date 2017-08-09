'use strict';

angular.module('BlurAdmin.services').factory('deviceService', function(BaseService) {
  return new BaseService('devices');
});
