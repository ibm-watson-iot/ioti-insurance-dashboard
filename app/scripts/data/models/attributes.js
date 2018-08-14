angular.module('BlurAdmin.data.models').factory('Attributes', function () {
  return {
    relations: {
      belongsTo: {
        user: {
          localKey: 'externalAttributeId',
          localField: 'user'
        }
      }
    }
  };
});
