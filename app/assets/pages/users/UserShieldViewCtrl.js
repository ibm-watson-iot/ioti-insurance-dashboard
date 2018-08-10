(function() {
  'use strict';

  angular.module('BlurAdmin.pages.users').controller('UserShieldViewCtrl', UserShieldViewCtrl);

  function UserShieldViewCtrl($stateParams, Store) {
    var vm = this;
    vm.userShield = {};

    if ($stateParams.shieldId) {
      Store.find('shield', $stateParams.shieldId).then(function(shield) {
        vm.userShield = shield;
      });
    }
  }
})();
