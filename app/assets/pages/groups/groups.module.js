/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.groups', []).config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider.state('main.group-edit', {
      url: 'groups/:groupId',
      templateUrl: 'pages/groups/group-edit.html',
      title: 'Edit Group'
    }).state('main.groups', {
      url: 'groups',
      templateUrl: 'pages/groups/group-list.html',
      title: 'Groups',
      sidebarMeta: {
        icon: 'fa fa-group',
        order: 4
      }
    });
  }

}());
