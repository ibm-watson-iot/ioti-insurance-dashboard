(function() {
'use strict';

angular.module('BlurAdmin.pages.users').controller('UserViewCtrl', UserViewCtrl);

function UserViewCtrl($stateParams, userService, shieldService, shieldActivationService,
  deviceService, hazardService, claimService) {
  var vm = this;
  vm.user = {};
  vm.uuidToShieldMap = {};
  vm.userShields = [];

  if ($stateParams.userId) {
    shieldService.findAll().success(function(data) {
      _.each(data.items, function(shield) {
        vm.uuidToShieldMap[shield._id] = shield;
        if (shield.needsActivationCheck !== true) {
          vm.userShields.push({ shieldId: shield._id });
        }
      });
    }).error(function(err) {
      console.error("Fetching all shields has failed!");
    });

    userService.find($stateParams.userId).success(function(user) {
      vm.user = user;
      shieldActivationService.findAll({userId: $stateParams.userId}).success(function(data) {
        vm.userShields = vm.userShields.concat(data.items);
      });

      deviceService.findAll({userId: $stateParams.userId}).success(function(data) {
        vm.userDevices = data.items;
      });

      hazardService.findAll({descending: true, userId: $stateParams.userId}).success(function(data) {
        vm.userHazards = data.items;
      });

      claimService.findAll({userId: $stateParams.userId}).success(function(data) {
        vm.userClaims = data;
      }).error(function(err) {
        vm.userClaims = [];
        console.log('Failed to retrieve claims !');
      });
    });
  }
}

})();
