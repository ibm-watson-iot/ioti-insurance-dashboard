/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.actions').controller('ActionEditCtrl', ActionEditCtrl);

function ActionEditCtrl($state, $stateParams, toastr, uuid4, actionService) {
  var vm = this;
  vm.action = { };
  vm.callbackAuthEnabled = false;

  if($stateParams.actionId && $stateParams.actionId !== 'new') {
    actionService.find($stateParams.actionId).success(function(action) {
      vm.action = action;
      if (vm.action.callbackAction.auth) {
        vm.callbackAuthEnabled = true;
      }
    });
  } else {
    vm.isNewAction = true;
    vm.action = {
      name: '',
      description: '',
      type: '',
      callbackAction: {}
    };
  }

  vm.saveAction = function() {
    actionService.save(vm.action)
    .then(function(resp) {
      _.merge(vm.action, resp.data);
      toastr.success('Saving action was successful');
    })
    .catch(function(err) {
      toastr.error("Saving action is failed!", "Error");
    });
  };

}

})();
