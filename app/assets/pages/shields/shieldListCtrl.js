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
        templateUrl: 'pages/modals/prompt/prompt.html',
        controller: 'ModalPromptCtrl',
        size: 'sm',
        resolve: {
          canCancel: true,
          title: function() {
            return 'Delete Shield';
          },
          message: function() {
            return 'Do you really want to delete shield "' + shield.name + '"?';
          }
        }
      });
      return modalInstance.result.then(function() {
        return shield.destroy();
      });
    };

    vm.saveShield = function(shield) {
      return shield.save();
    };

    editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes.bs3.cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';
  }

}());
