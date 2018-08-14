/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.actions').controller('ActionListCtrl', ActionListCtrl);

  function ActionListCtrl($rootScope, $uibModal, editableThemes, toastr, Store) {
    var vm = this;
    vm.actions = Store.getLiveArray('action');

    Store.findAll('action').catch(function(err) {
      console.error('Fetching all actions is failed!');
    });

    vm.saveAction = function(action) {
      return action.save()
    };

    vm.deleteAction = function(action) {
      return Store.destroy('action', action._id);
    };


    editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes.bs3.cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

  }
}());
