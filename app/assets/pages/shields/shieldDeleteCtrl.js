/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldDeleteCtrl', function(
    $scope, $uibModalInstance, shield) {

  $scope.shield = shield;

  $scope.apply = function() {
    $uibModalInstance.close($scope.shield);
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

});

})();
