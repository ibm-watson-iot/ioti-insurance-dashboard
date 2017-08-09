'use strict';

angular.module('BlurAdmin.services').factory('shieldService', function(BaseService) {
  return new BaseService('shields');
});
