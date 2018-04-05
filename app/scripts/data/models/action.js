angular.module('BlurAdmin.data.models').factory('Action', function () {
  return {
    relations: {
      hasMany: {
        shield: {
          foreignKeys: 'actionIds',
          localField: 'shields'
        },
        user: {
          localKey: 'userId',
          localField: 'user'
        }
      }
    }
  };
});
