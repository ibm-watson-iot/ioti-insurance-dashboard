(function () {
  'use strict';

  angular.module('BlurAdmin.pages.modals').controller('ModalPromptCtrl', ModalPromptCtrl);

  function ModalPromptCtrl($scope, $uibModalInstance, title, message, canCancel) {

    $scope.title = title;
    $scope.message = message;
    $scope.canCancel = canCancel;
    $scope.confirm = function() {
      $uibModalInstance.close();
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };
  }
})();
