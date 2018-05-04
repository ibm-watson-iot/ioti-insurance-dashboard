angular.module('BlurAdmin.data.models').factory('CommonShield', function() {
  return {
    relations: {
      hasMany: {
        'shield-code': {
          foreignKey: 'commonShieldId',
          localField: 'shieldCodes'
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
