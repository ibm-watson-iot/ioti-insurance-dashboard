/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'BlurAdmin.pages.login',
    'BlurAdmin.pages.main',
    'BlurAdmin.pages.profile',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.claims',
    'BlurAdmin.pages.hazards',
    'BlurAdmin.pages.users',
    'BlurAdmin.pages.shields',
    'BlurAdmin.pages.modals',
    'BlurAdmin.pages.actions'
  ]).config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/');
  }

})();
