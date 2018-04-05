/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.shields').controller('ShieldListCtrl', ShieldListCtrl);

  function ShieldListCtrl($rootScope, $uibModal, editableThemes, toastr, Store) {
    var vm = this;
    vm.allShields = Store.getLiveArray('shield');

    Store.findAll('shield').catch(function(err) {
      console.error('Fetching all shields is failed!');
    });

    vm.deleteShield = function(shield) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'pages/shields/shield-delete.html',
        controller: 'ShieldDeleteCtrl',
        size: 'sm',
        resolve: {
          shield: function() {
            return shield;
          }
        }
      });
      modalInstance.result.then(function(shieldToDelete) {
        Store.destroy('shield', shieldToDelete._id).then(function(data) {
          toastr.success(null, 'Deleting the shield is successful.');
        }).catch(function(err) {
          console.error('Deleting the shield is failed!');
        });
      }, function() {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    vm.saveShield = function(shield) {
      shield.save().then(function() {
        toastr.success(null, 'Saving shield is successful.');
      }).catch(function(err) {
        console.error('Saving shield is failed!');
        toastr.error('Saving shield is failed!', 'Error');
      });
    };

    editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes.bs3.cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
  }

}());
