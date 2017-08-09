(function() {
'use strict';

angular.module('BlurAdmin.pages.login').controller('LoginCtrl', LoginCtrl);

function LoginCtrl($rootScope, $scope, $state, toastr, authenticationService, userService) {

  var vm = this;

  vm.signIn = function() {
    authenticationService.authenticate();
  };

}

})();
