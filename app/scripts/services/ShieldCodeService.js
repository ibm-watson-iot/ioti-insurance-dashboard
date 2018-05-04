'use strict';

angular.module('BlurAdmin.services').factory('shieldCodeService', function(BaseService, $http) {
  var service = new BaseService('shield-codes');
  service.save = function (model) {

    // clone the model as jobOptions needs to be modified to be string
    var modelToSend = JSON.parse(JSON.stringify(model));
    modelToSend.jobOptions = JSON.stringify(modelToSend.jobOptions);

    if(modelToSend._id) {
      return $http.put(this.apiUrl + modelToSend._id, modelToSend);
    } else {
      return $http.post(this.apiUrl, modelToSend);
    }
  };
  return service;
});
