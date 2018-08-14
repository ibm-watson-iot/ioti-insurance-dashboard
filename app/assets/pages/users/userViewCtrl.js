(function() {


  angular.module('BlurAdmin.pages.users').controller('UserViewCtrl', UserViewCtrl);

  function UserViewCtrl($stateParams, Store) {
    var vm = this;
    vm.user = {};

    if ($stateParams.userId) {
      Store.find('user', $stateParams.userId).then(function(user) {
        vm.user = user;
      });
    }
  }

}());
