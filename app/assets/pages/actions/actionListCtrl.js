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
      action.save().then(function() {
        toastr.success(null, 'Saving action is successful.');
      }).catch(function(err) {
        console.error('Saving action is failed!');
        toastr.error('Saving action is failed!', 'Error');
      });
    };

    vm.deleteAction = function(action) {
      Store.destroy('action', action._id).then(function() {
        var index = vm.actions.indexOf(action);
        vm.actions.splice(index, 1);
        toastr.success(null, 'Deleting action was successful.');
      }).catch(function(err) {
        console.error('Deleting action has failed!');
        toastr.error('Deleting action has failed!', 'Error');
      });
    };


    editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes.bs3.cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

  }
}());
