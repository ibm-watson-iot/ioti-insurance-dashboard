/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldCodeEditCtrl', ShieldCodeEditCtrl);

function ShieldCodeEditCtrl($state, $stateParams, toastr, uuid4, shieldCodeService, actionService) {
  var vm = this;
  vm.shieldCode = { };
  vm.saving = false;

  actionService.findAll().then(function (resp) {
    vm.actions = resp.data.items;
  });

  if($stateParams.shieldCodeId && $stateParams.shieldCodeId !== 'new') {
    shieldCodeService.find($stateParams.shieldCodeId).success(function(shieldCode) {
      vm.shieldCode = shieldCode;
    });
  } else {
    vm.isNewShieldCode = true;
    vm.shieldCode = {
      shieldId: $stateParams.shieldId,
      jobOptions: {}
    };
  }

  vm.saveShieldCode = function() {
    vm.saving = true;
    shieldCodeService.save(vm.shieldCode)
    .then(function(resp) {
      _.merge(vm.shieldCode, resp.data);
      vm.saving = false;
      toastr.success('Saving shieldCode was successful');
      $state.transitionTo('main.shield-code-edit', {shieldCodeId: vm.shieldCode._id});
    })
    .catch(function(err) {
      vm.saving = false;
      toastr.error("Saving shieldCode is failed!", "Error");
    });
  };

}

})();
