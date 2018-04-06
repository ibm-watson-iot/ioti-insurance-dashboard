(function() {


  angular.module('BlurAdmin.pages.login').controller('LoginCtrl', LoginCtrl);

  function LoginCtrl($rootScope, $scope, $state, toastr, authenticationService) {

    var vm = this;

    vm.signIn = function() {
      authenticationService.authenticate();
    };
  }

}());
