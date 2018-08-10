/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
'use strict';

// global window variables for Medallia NPS
var Medallia =  {
    loaded: false,
    scan: null,
    daysSinceFirstLogin: 0
};

function loadScript(src,callback){

   var script = document.createElement("script");
   if (Medallia.loaded) return true;;
   script.type = "text/javascript";
   if(callback)script.onload=callback;
   Medallia.loaded = true;
   console.log("Loading Medallia embed script");

   document.getElementsByTagName("head")[0].appendChild(script);
   script.src = src;
   return true;
}

function loadScriptCb(){
   console.log("Medallia embed script loaded - loading rest");
   Medallia.scan = setInterval(function() {
      if (window.KAMPYLE_ONSITE_SDK != undefined) {
         console.log("Medallia NPS code ready " + window.KAMPYLE_ONSITE_SDK);
         clearInterval(Medallia.scan)
         Medallia.scan = null;
      }
      //else console.log("KAMPYLE not ready yet");
   });
   return true;
}

angular.module('BlurAdmin.data', []);
angular.module('BlurAdmin.data.record', []);
angular.module('BlurAdmin.data.adapters', []);
angular.module('BlurAdmin.data.models', []);

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
  'angular-loading-bar',

  'permission',
  'permission.ui',

  'BlurAdmin.configs',
  'BlurAdmin.utils',
  'BlurAdmin.services',
  'BlurAdmin.theme',
  'BlurAdmin.pages',
  'BlurAdmin.data'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, uiSelectConfig) {
  $httpProvider.interceptors.push('blurAdminHttpInterceptor');
  uiSelectConfig.theme = 'selectize';
  $locationProvider.html5Mode(true);
})
.run(function($rootScope, $state, editableOptions, editableThemes, PermRoleStore, authenticationService, customerICN, toastr) {

    // xeditable theme
    editableOptions.theme = 'bs3';
    editableThemes.bs3.inputClass = 'input-sm';

    String.prototype.capitalizeFirstLetter = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    PermRoleStore.defineRole('AUTHORIZED', function() {
      return authenticationService.isAuthenticated();
    });

    PermRoleStore.defineRole('ADMIN', function() {
      return authenticationService.isAdmin();
    });

    authenticationService.isAuthenticated().then(function() {
      $rootScope.loggedInUser = authenticationService.getUser();
      NPSinit(($rootScope.loggedInUser) ? ($rootScope.loggedInUser) : {}, customerICN, toastr);
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, params) {
      if (window.KAMPYLE_ONSITE_SDK && authenticationService.isStillAuthenticated()) {
        // notify NPS code of page update
        window.KAMPYLE_ONSITE_SDK.updatePageView();
      }
      if (toState.redirectTo) {
        event.preventDefault();
        $state.go(toState.redirectTo, params, { location: 'replace' });
      }
    });
});
