(function() {
  'use strict';

  angular.module('BlurAdmin.pages.users').controller('UserDeviceViewCtrl', UserDeviceViewCtrl);

  function UserDeviceViewCtrl($stateParams, Store, gmapsHandler) {
    var vm = this;
    vm.userDevice = {};

    if ($stateParams.deviceId) {
      Store.find('device', $stateParams.deviceId).then(function(device) {
        vm.userDevice = device;
        showInMap(device);
      });
    }

    const showInMap = function(device) {
      gmapsHandler.initGmaps();
      if (device.location
        && device.location.geometry
        && device.location.geometry.coordinates) {
        gmapsHandler.showInMap({
          type: 'latLng',
          latLng: {
            lat: device.location.geometry.coordinates[0],
            lng: device.location.geometry.coordinates[1]
          }
        });
      }
    };
  }
})();
