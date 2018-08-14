/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {


  angular.module('BlurAdmin.pages.profile').controller('ProfilePageCtrl', ProfilePageCtrl);

  /** @ngInject */
  function ProfilePageCtrl($scope, $filter, $uibModal, fileReader, toastr, Store) {

    var isFullnameChanged = false;
    var isEmailChanged = false;
    var isPhoneNumberChanged = false;

    $scope.phoneNumbers = ['+4917672246110', '+4915207145469'];

    Store.find('user', $scope.loggedInUser.sub).then(function(user) {
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

    }).catch(function(err) {
      console.error('Fetching the user is failed.');
    });

    function updatePartial(partial) {
      Store.update('user', $scope.user._id, partial).then(function(data) {
        toastr.success(null, 'Updating profile is successful.');
      }).catch(function(err) {
        toastr.error('Updating profile is failed!', 'Error');
      });
    }

    $scope.saveUser = function() {
      if (isFullnameChanged) {
        updatePartial({ fullname: $scope.user.fullname });
      }
      if (isEmailChanged) {
        updatePartial({ email: $scope.user.email });
      }
      if (isPhoneNumberChanged) {
        updatePartial({ phoneNumber: $scope.user.phoneNumber });
      }
    };

  }

}());
