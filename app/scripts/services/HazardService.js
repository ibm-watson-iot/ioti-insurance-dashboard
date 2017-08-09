'use strict';

angular.module('BlurAdmin.services').factory('hazardService', function(BaseService) {
  return new BaseService('hazards');
});
