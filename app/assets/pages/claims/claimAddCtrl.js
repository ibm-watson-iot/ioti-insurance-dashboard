(function() {
  'use strict';

  angular.module('BlurAdmin.pages.claims').controller('ClaimAddCtrl', ClaimAddCtrl);

  function ClaimAddCtrl($state, $stateParams, toastr, claimService, userService) {
    var vm = this;
    vm.claim = {};
    vm.claims = [];

    if ($state.params.userId && $state.params.hazardId) {
      userService.find($state.params.userId).success(function(user) {
        vm.user = user;
        vm.claim = {
          userId: $state.params.userId,
          hazardId: $state.params.hazardId,
          damageDate: (new Date()).getTime()
        };
      });

      claimService.findAll({userId: $state.params.userId}).success(function(data) {
        vm.claims = data.items;
      }).error(function(err) {
        console.log("Failed to get claims history or user !");
      });
    } else {
      toastr.error("You did not select any hazard. Redirecting to hazards.!");
      setTimeout(function() {
        $state.go('main.hazards');
      }, 3000);
    }

    vm.damagaDate = new Date();
    vm.opened = false;
    vm.format = 'MM/dd/yyyy';
    vm.options = {
        showWeeks: false
    };
    vm.open = function() {
      vm.opened = true;
    }

    vm.saveClaim = function() {
      vm.claim.damagaDate = vm.damagaDate.getTime();
      claimService.save(vm.claim).success(function(savedClaim) {
        _.merge(vm.claim, savedClaim);
        toastr.success(null, "Saving claim is successful.");
        $state.go('main.claims');
      }).error(function(err) {
        toastr.error("Saving claim is failed!", "Error");
      });
    };

  }

})();
