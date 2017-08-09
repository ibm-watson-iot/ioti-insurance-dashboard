/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.dashboard').controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

function DashboardPieChartCtrl($rootScope, $scope, $timeout, $filter, baConfig, baUtil,
  shieldService, hazardService, deviceService, userService, claimService) {

  var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
  $scope.charts = [{
    color: pieColor,
    description: 'Hazards',
    stats: 0,
    icon: 'attention',
    link: 'main.hazards'
  }, {
    color: pieColor,
    description: 'Claims',
    stats: 0,
    icon: 'envelope',
    link: 'main.claims'
  }, {
    color: pieColor,
    description: 'Customers',
    stats: 7472,
    icon: 'person',
    link: 'main.customers'
  }, {
    color: pieColor,
    description: 'Shields',
    stats: 0,
    icon: 'shield',
    link: 'main.shields'
  }, {
    color: pieColor,
    description: 'Devices',
    stats: 37471,
    icon: 'device'
  }];

  hazardService.findAll().success(function(data) {
    var allHazardCount = data.totalItems;
    var hazardEvents = $filter('filter')(data.items, {ishandled: false});
    var allNonAcknowledgedCount = hazardEvents.length;
    $scope.charts[0].stats = allHazardCount + ' / ' + allNonAcknowledgedCount;
  }).error(function(err) {
    console.error("Fetching user's hazards is failed!");
  });

  claimService.findAll().success(function(data) {
    $scope.charts[1].stats = data.totalItems;
  }).error(function(err) {
    console.error("Fetching claims has failed!");
  });

  shieldService.findAll().success(function(data) {
    $scope.charts[3].stats = data.totalItems;
  }).error(function(err) {
    console.error("Fetching user's shields is failed!");
  });

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function loadPieCharts() {
    $('.chart').each(function () {
      var chart = $(this);
      chart.easyPieChart({
        easing: 'easeOutBounce',
        onStep: function (from, to, percent) {
          $(this.el).find('.percent').text(Math.round(percent));
        },
        barColor: chart.attr('rel'),
        trackColor: 'rgba(0,0,0,0)',
        size: 84,
        scaleLength: 0,
        animation: 2000,
        lineWidth: 9,
        lineCap: 'round',
      });
    });

    $('.refresh-data').on('click', function () {
      updatePieCharts();
    });
  }

  function updatePieCharts() {
    $('.pie-charts .chart').each(function(index, chart) {
      $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
    });
  }

  // $timeout(function () {
  //   loadPieCharts();
  //   updatePieCharts();
  // }, 3000);
}

})();
