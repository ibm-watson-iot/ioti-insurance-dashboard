/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.actions').controller('ActionListCtrl', ActionListCtrl);

function ActionListCtrl($rootScope, $uibModal, editableThemes, toastr, actionService) {
  var vm = this;
  vm.actions = [];

  actionService.findAll().success(function(data) {
    vm.actions = data.items;
  }).error(function(err) {
    console.error("Fetching all actions is failed!");
  });

  vm.saveAction = function(action) {
    actionService.save(action).success(function(savedAction) {
      _.merge(action, savedAction);
      toastr.success(null, "Saving action is successful.");
    }).error(function(err) {
      console.error("Saving action is failed!");
      toastr.error("Saving action is failed!", "Error");
    });
  };

  vm.deleteAction = function(action) {
    actionService.remove(action._id).success(function() {
      const index = vm.actions.indexOf(action);
      vm.actions.splice(index, 1);
      toastr.success(null, "Deleting action was successful.");
    }).error(function(err) {
      console.error("Deleting action has failed!");
      toastr.error("Deleting action has failed!", "Error");
    });
  };


  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

}
})();
