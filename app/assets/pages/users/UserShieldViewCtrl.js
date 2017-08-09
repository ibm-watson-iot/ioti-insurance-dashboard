(function() {
  'use strict';

  angular.module('BlurAdmin.pages.users').controller('UserShieldViewCtrl', UserShieldViewCtrl);

  function UserShieldViewCtrl($stateParams, shieldService) {
    var vm = this;
    vm.userShield = {};

    if ($stateParams.shieldId) {
      shieldService.find($stateParams.shieldId).success(function(shield) {
        vm.userShield = shield;
      });
    }
  }
})();
