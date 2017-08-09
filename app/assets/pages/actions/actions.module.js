/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.actions', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider.state('main.action-edit', {
    url: 'actions/:actionId',
    templateUrl: 'pages/actions/action-edit.html',
    title: 'Edit Action'
  }).state('main.actions', {
    url: 'actions',
    templateUrl: 'pages/actions/action-list.html',
    title: 'Actions',
    sidebarMeta: {
      icon: 'fa fa-bell-o',
      order: 5
    }
  });
}

})();
