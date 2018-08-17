(function() {


  angular.module('BlurAdmin.pages.users').controller('UserViewCtrl', UserViewCtrl);

  function UserViewCtrl($stateParams, Store, accessControlAttributes) {
    var vm = this;
    vm.user = {};
    vm.availableAttributes = accessControlAttributes;

    if ($stateParams.userId) {
      Store.find('user', $stateParams.userId).then(function (user) {
        vm.user = user;
        vm.user.attributes.then(function (attrs) {
          if (!attrs) {
            vm.user.attributes = Store.createRecord('attributes', {
              type: 'user',
              attributes: [],
              externalAttributeId: vm.user._id
            });
          }
          vm.user.attributes.value.attributes.forEach(function (i) {
            if (vm.availableAttributes.indexOf(i) === -1) {
              vm.availableAttributes.push(i);
            }
          });
        });
      });
    }
    vm.removeAttr = function(attr) {
      vm.user.attributes.value.attributes.splice(vm.user.attributes.value.attributes.indexOf(attr), 1);
    };

    vm.addAttr = function(attr) {
      if (vm.user.attributes.value.attributes.indexOf(vm.newAttr) === -1) {
        vm.user.attributes.value.attributes.push(vm.newAttr);
      }
    };
  }
}());
