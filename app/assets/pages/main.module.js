/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
(function() {
'use strict';

angular.module('BlurAdmin.pages.main', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'pages/main.html',
      redirectTo: 'main.dashboard',
      data: {
        permissions: {
          only: ['AUTHORIZED'],
          redirectTo: function() {
            return {
              state: 'signin',
              options: {
                reload: true
              }
            };
          }
        }
      }
    });
}

})();
