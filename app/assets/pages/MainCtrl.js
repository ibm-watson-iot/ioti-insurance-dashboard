'use strict';

angular.module('BlurAdmin.pages').controller('MainCtrl', function(
  $rootScope, $scope, authenticationService, notificationService) {

  authenticationService.isAdmin().then(function(isAdmin) {
    $scope.isAdmin = isAdmin;
  });
  notificationService.enable();
});
