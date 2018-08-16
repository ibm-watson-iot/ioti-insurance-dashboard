/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.policies').controller('PolicyEditCtrl', PolicyEditCtrl);

  angular.module('BlurAdmin.pages.policies')
    .filter('toObject', function() {
      const cache = {};
      return function(input) {
        if (!input) return undefined;
        return input.map(function(i) {
          if (!cache[i]) {
            cache[i] = {
              value: i
            };
          }
          return cache[i];
        });
      };
    });

  function PolicyEditCtrl($state, $stateParams, $uibModal, toastr, Store, $scope, accessControlAttributes) {
    var vm = this;
    vm.policy = { };
    vm.availableAttributes = accessControlAttributes.map(function(a) {
      return {
        value: a,
        text: a
      };
    });

    if ($stateParams.policyId && $stateParams.policyId !== 'new') {
      Store.find('policy', $stateParams.policyId).then(function(policy) {
        vm.policy = policy;
        var ops = ['read', 'create', 'update', 'delete'];
        ops.forEach(function(o) {
          policy.operations[o].forEach(function(op) {
            op.forEach(function(attr) {
              if (!vm.availableAttributes.find(function(a) { return a.value === attr; })) {
                vm.availableAttributes.push({
                  value: attr,
                  text: attr
                });
              }
            });
          });
        });
      });
    } else {
      vm.isNewPolicy = true;
      vm.policy = Store.createRecord('policy', {
        resource: '',
        operations: {
          read: [],
          create: [],
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

    vm.removeAttr = function(op, attr) {
      var index = vm.policy.operations[op].indexOf(attr);
      vm.policy.operations[op].splice(index, 1);
    };

    vm.addAttr = function(op) {
      vm.policy.operations[op].push([]);
    };
  }

}());
