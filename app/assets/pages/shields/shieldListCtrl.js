/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldListCtrl', ShieldListCtrl);

function ShieldListCtrl($rootScope, $timeout, $uibModal, editableThemes, toastr, shieldService, shieldCodeService, shieldActivationService) {
  var vm = this;
  vm.allShields = [];
  vm.shieldCodes = {};

  $timeout(function() {
    getShields();
  },10)

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

  function getShields() {
    vm.isLoading = false;

    shieldService.findAll().success(function(data) {
      vm.allShields = data.items;
    }).error(function(err) {
      console.error("Fetching all shields is failed!");
    });

    shieldCodeService.findAll().then(function(result) {
      var items = result.data.items;
      items = _.sortBy(items, 'createdAt');
      items.forEach(function(item) {
        if (!vm.shieldCodes[item.shieldId]) {
          vm.shieldCodes[item.shieldId] = [];
        }
        vm.shieldCodes[item.shieldId].push(item);
      });
    });
  }

  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
}

})();
