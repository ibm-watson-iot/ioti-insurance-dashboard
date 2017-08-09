/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
'use strict';

angular.module('BlurAdmin', [
  'uuid',
  'toastr',
  'ngTouch',
  'ngJsTree',
  'ngAnimate',
  'xeditable',
  'smart-table',
  'ui.router',
  'ui.sortable',
  'ui.bootstrap',
  'ui.slimscroll',
  'ui.select',
  'angular-progress-button-styles',
  'angular-jwt',

  'permission',
  'permission.ui',

  'BlurAdmin.configs',
  'BlurAdmin.utils',
  'BlurAdmin.services',
  'BlurAdmin.theme',
  'BlurAdmin.pages'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, uiSelectConfig) {
  $httpProvider.interceptors.push('blurAdminHttpInterceptor');
  uiSelectConfig.theme = 'selectize';
  $locationProvider.html5Mode(true);
})
.run(function($rootScope, $state, editableOptions, editableThemes, PermRoleStore, authenticationService) {

    // xeditable theme
    editableOptions.theme = 'bs3';
    editableThemes.bs3.inputClass = 'input-sm';

    String.prototype.capitalizeFirstLetter = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }

    PermRoleStore.defineRole('AUTHORIZED', function() {
      return authenticationService.isAuthenticated();
    });

    PermRoleStore.defineRole('ADMIN', function() {
      return authenticationService.isAdmin();
    });

    authenticationService.isAuthenticated().then(function() {
      $rootScope.loggedInUser = authenticationService.getUser();
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, params) {
      if (toState.redirectTo) {
        event.preventDefault();
        $state.go(toState.redirectTo, params, { location: 'replace' });
      }
    });
});
