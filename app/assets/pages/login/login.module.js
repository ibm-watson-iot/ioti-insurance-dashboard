/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
(function() {
'use strict';

angular.module('BlurAdmin.pages.login', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'pages/login/signin.html'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'pages/login/signup.html'
    })
    .state('forgotpwd', {
      url: '/signin/forgot',
      templateUrl: 'pages/login/forgotpwd.html'
    })
    .state('confirm', {
      url: '/signup/confirm',
      templateUrl: 'pages/login/confirm.html'
    });
}

})();
