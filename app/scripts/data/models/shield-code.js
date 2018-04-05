angular.module('BlurAdmin.data.models').factory('ShieldCode', function() {
  return {
    relations: {
      belongsTo: {
        user: {
          localKey: 'userId',
          localField: 'user'
        },
        shield: {
          localKey: 'shieldId',
          localField: 'shield'
        },
        'common-shield': {
          localKey: 'commonShieldId',
          localField: 'commonShield'
        }
      }
    }
  };
});
