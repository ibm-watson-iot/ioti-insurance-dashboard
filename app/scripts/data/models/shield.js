angular.module('BlurAdmin.data.models').factory('Shield', function () {
  return {
    relations: {
      hasMany: {
        'shield-activation': {
          foreignKey: 'shieldId',
          localField: 'shieldActivations'
        },
        'shield-code': {
          foreignKey: 'shieldId',
          localField: 'shieldCodes'
        },
        action: {
          localKeys: 'actionIds',
          localField: 'actions'
        }
      },
      belongsTo: {
        user: {
          localKey: 'userId',
          localField: 'user'
        }
      }
    }
  };
});
