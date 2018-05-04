/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldEditCtrl', ShieldEditCtrl);

function ShieldEditCtrl($state, $stateParams, $uibModal, toastr, shieldService, shieldCodeService, actionService, commonShieldService) {
  var vm = this;
  vm.shield = {};
  vm.shieldcodes = [];
  vm.commonShieldsMap = {};
  vm.saving = false;

  actionService.findAll().then(function (resp) {
    vm.actions = resp.data.items;
  });

  commonShieldService.findAll().then(function (resp) {
    _.each(resp.data.items, function(commonShield) {
      vm.commonShieldsMap[commonShield._id] = commonShield;
    });
  });

  if($stateParams.shieldId && $stateParams.shieldId !== 'new') {
    shieldCodeService.findAll({shieldId: $stateParams.shieldId}).then(function (resp) {
      vm.shieldcodes = resp.data.items;
    });
    shieldService.find($stateParams.shieldId).success(function(shield) {
      vm.shield = shield;
    });
  } else {
    vm.isNewShield = true;
    vm.shield = {
      image: "shieldWater",
      canBeDisabled: false,
      hazardDetectionOnCloud: true,
      services: [],
      shieldHazards: [],
      sensorType: "",
      shieldParameters: []
    };
  }

  vm.getCommonShieldName = function(commonShieldId) {
      var cs = vm.commonShieldsMap[commonShieldId];
      return cs ? cs.name : '';
  }

  vm.saveShield = function() {
    vm.saving = true;
    shieldService.save(vm.shield)
    .then(function(resp) {
      _.merge(vm.shield, resp.data);
      toastr.success('Saving shield was successful');
      vm.saving = false;
      $state.transitionTo('main.shield-edit', {shieldId: vm.shield._id});
    })
    .catch(function(err) {
      vm.saving = false;
      toastr.error("Saving shield is failed!", "Error");
    });
  };

  vm.deleteShieldCode = function (code) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'pages/modals/prompt/prompt.html',
      controller: 'ModalPromptCtrl',
      size: 'sm',
      resolve: {
        title: function () {
          return 'Delete Shield Code';
        },
        message: function () {
          return 'Do you really want to delete shield code "' + code.name + '"';
        }
      }
    });
    modalInstance.result.then(function() {
      vm['deleting_' + code._id] = true;
      shieldCodeService.remove(code._id).success(function(resp) {
        var index = vm.shieldcodes.indexOf(code);
        vm.shieldcodes.splice(index, 1);
        toastr.success(null, "Deleting the shield code was successful.");
        delete vm['deleting_' + code._id];
      }).error(function(err) {
        console.error("Deleting the shield code has failed!");
        delete vm['deleting_' + code._id];
      });
    });
  }

}

})();
