/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.policies').controller('PolicyEditCtrl', PolicyEditCtrl);

  function PolicyEditCtrl($state, $stateParams, $uibModal, toastr, Store, $scope) {
    var vm = this;
    vm.policy = { };
    vm.saving = false;

    Store.find('action').then(function(actions) {
      vm.actions = actions;
    });

    if ($stateParams.policyId && $stateParams.policyId !== 'new') {
      Store.find('policy', $stateParams.policyId).then(function(policy) {
        vm.policy = policy;
      });
    } else {
      vm.isNewPolicy = true;
      vm.policy = Store.createRecord('policy', {
        resource: '',
        operations: {
          read: [],
          write: [],
          update: [],
          delete: []
        }
      });
    }

    vm.isValid = false;

    $scope.$watchGroup([
      'policyEditCtrlVm.policy.resource',
      'policyEditCtrlVm.policy.operations'], function() {
      var policy = vm.policy;
      vm.isValid = policy.resource !== '' &&
        policy.operations &&
        (policy.operations.read || policy.operations.write ||
          policy.operations.update || policy.operations.delete);
    });

    vm.savePolicy = function() {
      return vm.policy.save().then(function() {
        $state.transitionTo('main.policy-edit', { policyId: vm.policy._id });
      });
    };
  }

}());
