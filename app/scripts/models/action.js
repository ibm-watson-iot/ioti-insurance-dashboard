angular.module('BlurAdmin').factory('ShieldCode', function (DS) {
  return DS.defineResource('shield-code', {
    relations: {
      belongsTo: {
        shield: {
          foreignKey: 'shield_id',
          localField: 'shield'
        },
        user: {
          foreignKey: 'user_id',
          localField: 'user'
        }
      }
    }
  });
});