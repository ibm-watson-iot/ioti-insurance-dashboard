'use strict';

angular.module('BlurAdmin.services').factory('actionService', function(BaseService) {
  return new BaseService('actions');
});
