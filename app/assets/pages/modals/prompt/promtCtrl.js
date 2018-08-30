(function () {
  'use strict';

  angular.module('BlurAdmin.pages.modals').controller('ModalPromptCtrl', ModalPromptCtrl);

  function ModalPromptCtrl($scope, $uibModalInstance, title, message, cannotCancel) {

    $scope.title = title;
    $scope.message = message;
    $scope.cannotCancel = cannotCancel;
    $scope.confirm = function() {
      $uibModalInstance.close();
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };
  }
})();
