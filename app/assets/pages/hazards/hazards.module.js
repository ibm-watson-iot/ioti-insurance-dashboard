/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.hazards', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider.state('main.hazards', {
    url: 'hazards',
    templateUrl: 'pages/hazards/hazard-list.html',
    title: 'Hazards',
    sidebarMeta: {
      icon: 'fa fa-bolt',
      order: 1
    }
  }).state('main.hazard-view', {
    url: 'hazards/:hazardEventId',
    templateUrl: 'pages/hazards/hazard-view.html',
    title: 'Hazard'
  });
}

})();
