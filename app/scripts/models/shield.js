angular.module('BlurAdmin').factory('Shield', function (DS) {
  return DS.defineResource('shield', {
    relations: {
      hasMany: {
        'shield-code': {
          foreignKey: 'shield_id',
          localField: 'shieldCodes'
        },
        action: {
          localKeys: 'action_ids',
          localField: 'actions'
        }
      },
      belongsTo: {
        user: {
          foreignKey: 'user_id',
          localField: 'user'
        }
      }
    }
  });
});