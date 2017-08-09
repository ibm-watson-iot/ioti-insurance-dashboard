/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldListCtrl', ShieldListCtrl);

function ShieldListCtrl($rootScope, $uibModal, editableThemes, toastr, shieldService, shieldActivationService) {
  var vm = this;
  vm.allShields = [];
  vm.userShields = [];
  vm.activeShields = {};
  var shieldActivations = [];
  var shieldToActivationsMap = {};

  shieldService.findAll().success(function(data) {
    vm.allShields = data.items;

    shieldActivationService.findAll($rootScope.loggedInUser.userId).success(function(data) {
      shieldActivations = data.items;

      _.each(shieldActivations, function(shieldActivation) {
        _.each(vm.allShields, function(shield) {
          if (shield._id === shieldActivation.shieldId) {
            if (vm.userShields.indexOf(shield) === -1) {
              vm.userShields.push(shield);
              vm.activeShields[shield._id] = true;
            }
          }
        });
        shieldToActivationsMap[shieldActivation.shieldId] = shieldActivation;
      });

    }).error(function(err) {
      console.error("Fetching all shields is failed!");
    });

  }).error(function(err) {
    console.error("Fetching all shields is failed!");
  });

  vm.activate = function(shield) {
    var shieldActivation = {
      shieldId: shield._id,
      userId: $rootScope.loggedInUser.userId,
      hazardDetectionOnCloud: true
    };
    shieldActivationService.save(shieldActivation).success(function(savedActivation) {
      vm.userShields.push(shield);
      vm.activeShields[shield._id] = true;
      shieldActivations.push(savedActivation);
      shieldToActivationsMap[savedActivation.shieldId] = savedActivation;
      toastr.success(null, "Activating the shield is successful.");
    }).error(function(err) {
      console.error("Saving shield activation is failed!");
    });
  };

  vm.deactivate = function(shield) {
    var shieldActivation = shieldToActivationsMap[shield._id];
    shieldActivationService.remove(shieldActivation._id).success(function() {
      delete vm.activeShields[shield._id];
      _.remove(vm.userShields, function(userShield) {
          return userShield._id === shield._id;
      });
      toastr.success(null, "Deactivating the shield is successful.");
    }).error(function(err) {
      console.error("Deleting shield activation is failed!");
    });
  };

  vm.deleteShield = function(shield) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'pages/shields/shield-delete.html',
      controller: 'ShieldDeleteCtrl',
      size: 'sm',
      resolve: {
        shield: function () {
          return shield;
        }
      }
    });
    modalInstance.result.then(function(shieldToDelete) {
      shieldService.remove(shieldToDelete._id).success(function(data) {
        delete vm.activeShields[shield._id];
        _.remove(vm.allShields, function(shield) {
            return shield._id === shieldToDelete._id;
        });
        _.remove(vm.userShields, function(userShield) {
            return userShield._id === shieldToDelete._id;
        });
        toastr.success(null, "Deleting the shield is successful.");
      }).error(function(err) {
        console.error("Deleting the shield is failed!");
      });
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  vm.saveShield = function(shield) {
    shieldService.save(shield).success(function(savedShield) {
      _.merge(shield, savedShield);
      toastr.success(null, "Saving shield is successful.");
    }).error(function(err) {
      console.error("Saving shield is failed!");
      toastr.error("Saving shield is failed!", "Error");
    });
  };


  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

}

})();
