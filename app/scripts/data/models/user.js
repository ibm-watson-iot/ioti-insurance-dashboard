angular.module('BlurAdmin.data.models').factory('User', function () {
  return {
    relations: {
      hasOne: {
        attributes: {
          localKey: 'userId',
          foreignKey: 'externalAttributeId',
          localField: 'attributes'
        }
      },
      hasMany: {
        shield: {
          // In a hasMany relationship configured with
          // a foreignKey, the foreignKey specifies the
          // property of the child record that points
          // to the parent record,
          // i.e. console.log(post.user_id); // 12345
          foreignKey: 'userId',
          // In memory, a user's posts will be attached to
          // user objects via the user's "posts" property,
          // i.e. console.log(user.posts); // [{...}, {...}, ...]
          // and console.log(user.posts[0].user_id); // 12345
          localField: 'shields'
        },
        'shield-activation': {
          foreignKey: 'userId',
          localField: 'shieldActivations'
        },
        hazard: {
          foreignKey: 'userId',
          localField: 'hazards'
        },
        device: {
          foreignKey: 'userId',
          localField: 'devices'
        },
        claim: {
          foreignKey: 'userId',
          localField: 'claims'
        }
      }
    }
  };
});
