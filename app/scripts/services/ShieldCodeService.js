'use strict';

angular.module('BlurAdmin.services').factory('shieldCodeService', function(BaseService, $http) {
  var service = new BaseService('shield-codes');
  service.save = function (model) {
    var hasFile = false;
    var fd = new FormData();
    for(var key in model) {
      if (model.hasOwnProperty(key)) {
        if (model[key] instanceof Object && !(model[key] instanceof File || model[key] instanceof FileReader)) {
          fd.append(key, JSON.stringify(model[key]));
          continue;
        }
        if (model[key] instanceof File || model[key] instanceof FileReader) {
          hasFile = true;
        }
        fd.append(key, model[key]);
      }
    }
    if(model._id) {
      if (hasFile) {
        return $http.put(this.apiUrl + model._id, fd, {headers: {'Content-Type': undefined}});
      } else {
        return $http.post(this.apiUrl + model._id, model);
      }
    } else {
      if (hasFile) {
        return $http.post(this.apiUrl, fd, {headers: {'Content-Type': undefined}});
      } else {
        return $http.post(this.apiUrl, model);
      }
    }
  };
  return service;
});
