/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldListCtrl', ShieldListCtrl);

function ShieldListCtrl($rootScope, $uibModal, editableThemes, toastr, shieldService, Shield) {
  var vm = this;
  vm.allShields = [];

  Shield.findAll().success(function(data) {
    vm.allShields = data.items;
  }).error(function(err) {
    console.error("Fetching all shields is failed!");
  });

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
        _.remove(vm.allShields, function(shield) {
            return shield._id === shieldToDelete._id;
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
