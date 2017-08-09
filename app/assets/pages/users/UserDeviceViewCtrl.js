(function() {
  'use strict';

  angular.module('BlurAdmin.pages.users').controller('UserDeviceViewCtrl', UserDeviceViewCtrl);

  function UserDeviceViewCtrl($stateParams, deviceService) {
    var vm = this;
    vm.userDevice = {};

    if ($stateParams.deviceId) {
      deviceService.find($stateParams.deviceId).success(function(device) {
        vm.userDevice = device.devices;
      });
    }
  }
})();
