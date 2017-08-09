/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

'use strict';


angular.module('BlurAdmin.services').factory('BaseService', function(
  $http, apiProtocol, apiHost, apiPath, tenantId) {

  function BaseAdapter(name, baseUrl) {
    if (baseUrl) {
      this.apiUrl = baseUrl + name + '/';
    } else {
      this.apiUrl = apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/' + name + '/';
    }
  }

  BaseAdapter.prototype = {

    find: function(modelId) {
      return $http.get(this.apiUrl + modelId);
    },

    findAll: function(queryParams) {
      queryParams = queryParams || {};
      queryParams.userId = queryParams.userId || 'all';
      return $http.get(this.apiUrl, {
        params: queryParams
      });
    },

    remove: function(modelId) {
      return $http['delete'](this.apiUrl + modelId);
    },

    save: function(model) {
      if(model._id) {
        return $http.put(this.apiUrl + model._id, model);
      } else {
        return $http.post(this.apiUrl, model);
      }
    },

    updatePartial: function(modelId, partOfModel) {
      return $http.post(this.apiUrl + modelId, partOfModel);
    }
  };

  return BaseAdapter;
});
