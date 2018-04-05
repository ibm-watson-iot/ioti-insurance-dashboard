(function() {

  angular.module('BlurAdmin.pages.hazards').controller('HazardViewCtrl', HazardViewCtrl);

  function HazardViewCtrl($stateParams, $filter, toastr, Store, shieldService, gmapsHandler) {
    var vm = this;
    vm.hazard = {};

    if ($stateParams.hazardEventId) {
      Store.find('hazard', $stateParams.hazardEventId).then(function(hazard) {
        vm.hazard = hazard;
        showInMap(hazard);
      });
    }

    const showInMap = function(hazard) {
      gmapsHandler.initGmaps();
      if (hazard.locations) {
        hazard.locations.forEach(function(location) {
          if (location.geometry && location.geometry.coordinates) {
            gmapsHandler.showInMap({
              type: 'latLng',
              latLng: {
                lat: location.geometry.coordinates[0],
                lng: location.geometry.coordinates[1]
              }
            });
          }
        });
      }
    };

    vm.acknowledgeHazard = function(hazard) {
      hazard.ishandled = true;
      Store.update(hazard).then(function(data) {
        toastr.success('Acknowledged.');
      }).catch(function(err) {
        toastr.error('Saving hazard has failed!', 'Error');
      });
    };
  }

}());
