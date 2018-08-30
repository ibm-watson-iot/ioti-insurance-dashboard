(function() {


  angular.module('BlurAdmin.pages.users').controller('UserViewCtrl', UserViewCtrl);

  function UserViewCtrl($stateParams, Store, $state) {
    var vm = this;
    vm.user = {};

    if ($stateParams.userId) {
      Store.find('user', $stateParams.userId).then(function(user) {
        vm.user = user;
      });
    } else {
      vm.isNew = true;
      vm.user = {
        save: function() {
          return Store.create('user', vm.user).then(function(user) {
            $state.transitionTo('main.user-view', { userId: user._id });
          });
        },
        address: {}
      };
    }
  }

}());
