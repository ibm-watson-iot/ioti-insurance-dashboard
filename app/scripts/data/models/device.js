angular.module('BlurAdmin.data.models').factory('Device', function () {
  return {
    relations: {
      belongsTo: {
        user: {
          localKey: 'userId',
          localField: 'user'
        }
      }
    }
  };
});
