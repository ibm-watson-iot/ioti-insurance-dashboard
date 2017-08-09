'use strict';

angular.module('BlurAdmin.services').factory('shieldActivationService', function(BaseService) {
  return new BaseService('shield-activations');
});
