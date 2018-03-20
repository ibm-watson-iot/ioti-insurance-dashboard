angular.module('BlurAdmin').factory('User', function (DS) {
  return DS.defineResource('user', {
    defaultAdapter: 'user',
    relations: {
      hasMany: {
        shield: {
          // In a hasMany relationship configured with
          // a foreignKey, the foreignKey specifies the
          // property of the child record that points
          // to the parent record,
          // i.e. console.log(post.user_id); // 12345
          foreignKey: 'user_id',
          // In memory, a user's posts will be attached to
          // user objects via the user's "posts" property,
          // i.e. console.log(user.posts); // [{...}, {...}, ...]
          // and console.log(user.posts[0].user_id); // 12345
          localField: 'shields'
        },
        'shield-activation': {
          foreignKey: 'user_id',
          localField: 'shieldActivations'
        },
        hazard: {
          foreignKey: 'user_id',
          localField: 'hazards'
        },
        device: {
          foreignKey: 'user_id',
          localField: 'devices'
        }
      }
    }
  });
});