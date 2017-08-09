/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.users', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider.state('main.customers', {
    url: 'customers',
    templateUrl: 'pages/users/user-list.html',
    title: 'Customers',
    sidebarMeta: {
      icon: 'fa fa-user',
      order: 3
    }
  }).state('main.user-view', {
    url: 'customers/:userId',
    templateUrl: 'pages/users/user-view.html',
    title: 'Customer'
  }).state('main.user-shield-view', {
    url: 'customers/shields/:shieldId',
    templateUrl: 'pages/users/user-shield-view.html',
    title: 'View User Shield'
  }).state('main.user-device-view', {
    url: 'customers/devices/:deviceId',
    templateUrl: 'pages/users/user-device-view.html',
    title: 'View User Device'
  });
}

})();
