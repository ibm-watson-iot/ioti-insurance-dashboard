/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.policies', []).config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider.state('main.policy-edit', {
      url: 'policies/:policyId',
      templateUrl: 'pages/policies/policy-edit.html',
      title: 'Edit Policy'
    }).state('main.policies', {
      url: 'policies',
      templateUrl: 'pages/policies/policy-list.html',
      title: 'Policies',
      sidebarMeta: {
        icon: 'fa fa-lock',
        order: 4
      }
    });
  }
}());
