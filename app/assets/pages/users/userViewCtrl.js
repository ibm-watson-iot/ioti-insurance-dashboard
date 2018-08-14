(function() {


  angular.module('BlurAdmin.pages.users').controller('UserViewCtrl', UserViewCtrl);

  function UserViewCtrl($stateParams, Store) {
    var vm = this;
    vm.user = {};
    vm.newAttr = "new policy attr here";

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
