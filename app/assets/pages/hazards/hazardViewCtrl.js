(function() {
'use strict';

angular.module('BlurAdmin.pages.hazards').controller('HazardViewCtrl', HazardViewCtrl);

function HazardViewCtrl($stateParams, $filter, toastr, hazardService, shieldService, gmapsHandler, claimService) {
  var vm = this;
  vm.hazard = {};

  if ($stateParams.hazardEventId) {
    hazardService.find($stateParams.hazardEventId).success(function(hazard) {
      vm.hazard = hazard;
      showInMap(hazard);
      shieldService.find(vm.hazard.shieldId).success(function(shield) {
        vm.shield = shield;
      });
    });
    claimService.findAll({hazardId: $stateParams.hazardEventId}).success(function(claims) {
      vm.claims = claims;
    }).error(function(err) {
      console.log("Failed to get the claim of the hazard!");
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
    hazardService.updatePartial(hazard._id, {ishandled: true}).success(function(data) {
      toastr.success("Acknowledged.");
    }).error(function(err) {
      toastr.error("Saving hazard has failed!", "Error");
    });
  };
}

})();
