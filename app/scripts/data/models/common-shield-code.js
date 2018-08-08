angular.module('BlurAdmin.data.models').factory('CommonShieldCode', function() {
  return {
    relations: {
      hasMany: {
        'shield-code': {
          foreignKey: 'commonShieldCodeId',
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
