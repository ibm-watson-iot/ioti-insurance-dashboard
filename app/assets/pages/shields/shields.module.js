/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider.state('main.shield-edit', {
    url: 'shields/:shieldId',
    templateUrl: 'pages/shields/shield-edit.html',
    title: 'Edit Shield'
  }).state('main.shields', {
    url: 'shields',
    templateUrl: 'pages/shields/shield-list.html',
    title: 'Shields',
    sidebarMeta: {
      icon: 'fa fa-shield',
      order: 4
    }
  }).state('main.shield-code-edit', {
    url: 'shields/:shieldId/code/:shieldCodeId',
    templateUrl: 'pages/shields/shield-code-edit.html',
    title: 'Edit Shield Code'
  });
}

})();
