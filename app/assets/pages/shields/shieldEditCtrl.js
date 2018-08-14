/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.shields').controller('ShieldEditCtrl', ShieldEditCtrl);

  function ShieldEditCtrl($state, $stateParams, $uibModal, toastr, Store) {
    var vm = this;
    vm.shield = { };
    vm.saving = false;

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
      vm.saving = true;
      vm.shield.save()
        .then(function() {
          toastr.success('Saving shield was successful');
          vm.saving = false;
          $state.transitionTo('main.shield-edit', { shieldId: vm.shield._id });
        })
        .catch(function(err) {
          vm.saving = false;
          toastr.error('Saving shield is failed!', 'Error');
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
      modalInstance.result.then(function() {
        vm['deleting_' + code._id] = true;
        Store.destroy('shield-code', code._id).then(function(resp) {
          toastr.success(null, 'Deleting the shield code was successful.');
          delete vm['deleting_' + code._id];
        }).catch(function(err) {
          console.error('Deleting the shield code has failed!');
          delete vm['deleting_' + code._id];
        });
      });
    };

  }

}());
