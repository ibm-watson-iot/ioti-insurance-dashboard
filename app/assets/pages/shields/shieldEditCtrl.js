/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.shields').controller('ShieldEditCtrl', ShieldEditCtrl);

  function ShieldEditCtrl($state, $stateParams, $uibModal, toastr, Store) {
    var vm = this;
    vm.shield = { };

    Store.find('action').then(function(actions) {
      vm.actions = actions;
    });

    if ($stateParams.shieldId && $stateParams.shieldId !== 'new') {
      Store.find('shield', $stateParams.shieldId).then(function(shield) {
        vm.shield = shield;
      });
    } else {
      vm.isNewShield = true;
      vm.shield = Store.createRecord('shield', {
        image: 'shieldWater',
        canBeDisabled: false,
        hazardDetectionOnCloud: true,
        services: [],
        shieldHazards: [],
        sensorType: '',
        shieldParameters: []
      });
    }

    vm.saveShield = function() {
      return vm.shield.save()
        .then(function() {
          $state.transitionTo('main.shield-edit', { shieldId: vm.shield._id });
        });
    };

    vm.deleteShieldCode = function(code) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'pages/modals/prompt/prompt.html',
        controller: 'ModalPromptCtrl',
        size: 'sm',
        resolve: {
          title: function() {
            return 'Delete Shield Code';
          },
          message: function() {
            return 'Do you really want to delete shield code "' + code.name + '"';
          }
        }
      });
      return modalInstance.result.then(function() {
        return Store.destroy('shield-code', code._id);
      });
    };

  }

}());
