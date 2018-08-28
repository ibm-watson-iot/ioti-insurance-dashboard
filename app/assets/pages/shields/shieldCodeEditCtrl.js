/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.shields').controller('ShieldCodeEditCtrl', ShieldCodeEditCtrl);

  function ShieldCodeEditCtrl($state, $stateParams, toastr, Store) {
    var vm = this;
    vm.shieldCode = { };
    vm.saving = false;

    Store.findAll('common-shield-code', { type: 'cloud' }).then(function(resp) {
      vm.commonShields = resp;
    });

    if ($stateParams.shieldCodeId && $stateParams.shieldCodeId !== 'new') {
      Store.find('shield-code', $stateParams.shieldCodeId).then(function(shieldCode) {
        vm.shieldCode = shieldCode;
      });
    } else {
      vm.isNewShieldCode = true;
      vm.shieldCode = Store.createRecord('shield-code', {
        shieldId: $stateParams.shieldId,
        jobOptions: {}
      });
    }

    vm.saveShieldCode = function() {
      return vm.shieldCode.save().then(function() {
        $state.transitionTo('main.shield-code-edit', { shieldCodeId: vm.shieldCode._id });
      });
    };

  }

}());
