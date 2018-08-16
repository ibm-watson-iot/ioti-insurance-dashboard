/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.policies').controller('GroupEditCtrl', GroupEditCtrl);

  function GroupEditCtrl($state, $stateParams, $uibModal, toastr, Store, $scope, accessControlAttributes) {
    var vm = this;
    vm.group = { };
    vm.availableAttributes = accessControlAttributes;

    Store.find('action').then(function(actions) {
      vm.actions = actions;
    });

    if ($stateParams.groupId && $stateParams.groupId !== 'new') {
      Store.find('attributes', $stateParams.groupId).then(function(attributes) {
        vm.group = attributes;
      });
    } else {
      vm.isNewGroup = true;
      vm.group = Store.createRecord('attributes', {
        externalAttributeId: '',
        attributes: []
      });
    }

    vm.isValid = false;

    $scope.$watchGroup([
      'groupEditCtrlVm.group.attributes',
      'groupEditCtrlVm.group.externalAttributeId'], function() {
      var group = vm.group;
      vm.isValid = group.externalAttributeId !== '' && group.attributes;
    });

    vm.saveGroup = function() {
      return vm.group.save()
        .then(function() {
          $state.transitionTo('main.group-edit', { groupId: vm.group._id });
        });
    };
  }

}());
