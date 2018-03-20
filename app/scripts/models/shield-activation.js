angular.module('BlurAdmin').factory('ShieldActivation', function (DS) {
  return DS.defineResource('shield-activation', {
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