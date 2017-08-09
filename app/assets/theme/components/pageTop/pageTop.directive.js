/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components').directive('pageTop', pageTop);

  function pageTop($rootScope, $state, authenticationService) {
    return {
      restrict: 'E',
      templateUrl: 'theme/components/pageTop/pageTop.html',
      link: function (scope, element, attrs) {
        scope.signOut = function() {
          $rootScope.loggedInUser = undefined;
          authenticationService.signOut();
          $state.go('signin');
        };
      }
    };
  }

})();
