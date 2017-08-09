'use strict';

angular.module('BlurAdmin.pages').controller('MainCtrl', function(
  $rootScope, $scope, authenticationService, notificationService) {

  $scope.isAdmin = authenticationService.isAdmin();
  notificationService.enable();
});
