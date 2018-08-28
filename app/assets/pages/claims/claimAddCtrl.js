(function() {


  angular.module('BlurAdmin.pages.claims').controller('ClaimAddCtrl', ClaimAddCtrl);

  function ClaimAddCtrl($state, $stateParams, toastr, Store) {
    var vm = this;
    vm.claim = {};
    vm.claims = [];

    if ($state.params.userId && $state.params.hazardId) {
      Store.find('user', $state.params.userId).then(function(user) {
        vm.user = user;
        vm.claim = Store.createRecord('claim', {
          userId: $state.params.userId,
          hazardId: $state.params.hazardId,
          damageDate: (new Date()).getTime()
        });
      });
    } else {
      toastr.error('You did not select any hazard. Redirecting to hazards.!');
      setTimeout(function() {
        $state.go('main.hazards');
      }, 3000);
    }

    vm.damagaDate = new Date();
    vm.opened = false;
    vm.format = 'MM/dd/yyyy';
    vm.options = {
      showWeeks: false
    };
    vm.open = function() {
      vm.opened = true;
    };

    vm.saveClaim = function() {
      vm.claim.damagaDate = vm.damagaDate.getTime();
      return vm.claim.save().then(function() {
        $state.go('main.claims');
      });
    };

  }

}());
