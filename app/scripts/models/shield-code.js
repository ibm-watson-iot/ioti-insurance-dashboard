angular.module('BlurAdmin').factory('Action', function (DS) {
  return DS.defineResource('action', {
    relations: {
      hasMany: {
        shield: {
          foreignKeys: 'action_ids',
          localField: 'shield'
        }
      }
    }
  });
});