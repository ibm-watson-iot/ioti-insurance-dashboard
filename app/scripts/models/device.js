angular.module('BlurAdmin').factory('Device', function (DS) {
  return DS.defineResource('device', {
    relations: {
      belongsTo: {
        shield: {
          // In a hasMany relationship configured with
          // a foreignKey, the foreignKey specifies the
          // property of the child record that points
          // to the parent record,
          // i.e. console.log(post.user_id); // 12345
          foreignKey: 'shield_id',
          // In memory, a user's posts will be attached to
          // user objects via the user's "posts" property,
          // i.e. console.log(user.posts); // [{...}, {...}, ...]
          // and console.log(user.posts[0].user_id); // 12345
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