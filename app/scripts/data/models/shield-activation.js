angular.module('BlurAdmin.data.models').factory('ShieldActivation', function () {
  return {
    relations: {
      belongsTo: {
        shield: {
          localKey: 'shieldId',
          localField: 'shield'
        },
        user: {
          localKey: 'userId',
          localField: 'user'
        }
      }
    }
  };
});
