(function () {
  'use strict';

  angular.module('BlurAdmin.pages.modals').controller('ModalPromptCtrl', ModalPromptCtrl);

  function ModalPromptCtrl($scope, $uibModalInstance, title, message) {

    $scope.title = title;
    $scope.message = message;
    $scope.confirm = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  }
})();
