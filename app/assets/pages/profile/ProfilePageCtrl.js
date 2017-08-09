/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.profile').controller('ProfilePageCtrl', ProfilePageCtrl);

/** @ngInject */
function ProfilePageCtrl($scope, $filter, $uibModal, fileReader, toastr, userService) {

  var isFullnameChanged = false;
  var isEmailChanged = false;
  var isPhoneNumberChanged = false;

  $scope.phoneNumbers = [ "+4917672246110", "+4915207145469" ];

  userService.find($scope.loggedInUser.sub).success(function(user) {
    $scope.user = user;

    $scope.$watch('user.fullname', function(newValue, oldValue) {
      if (newValue && (oldValue !== newValue)) {
        isFullnameChanged = true;
      }
    });

    $scope.$watch('user.email', function(newValue, oldValue) {
      if (newValue && (oldValue !== newValue)) {
        isEmailChanged = true;
      }
    });

    $scope.$watch('user.phoneNumber', function(newValue, oldValue) {
      if (newValue && (oldValue !== newValue)) {
        isPhoneNumberChanged = true;
      }
    });

  }).error(function(err) {
    console.error("Fetching the user is failed.");
  });

  function updatePartial(partial) {
    userService.updatePartial($scope.user._id, partial).success(function(data) {
      toastr.success(null, "Updating profile is successful.");
    }).error(function(err) {
      toastr.error("Updating profile is failed!", "Error");
    });
  }

  $scope.saveUser = function() {
    if (isFullnameChanged) {
      updatePartial({'fullname': $scope.user.fullname});
    }
    if (isEmailChanged) {
      updatePartial({'email': $scope.user.email});
    }
    if (isPhoneNumberChanged) {
      updatePartial({'phoneNumber': $scope.user.phoneNumber});
    }
  };

}

})();
