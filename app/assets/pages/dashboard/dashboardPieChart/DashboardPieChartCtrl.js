/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {


  angular.module('BlurAdmin.pages.dashboard').controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

  function DashboardPieChartCtrl($rootScope, $scope, $timeout, $filter, baConfig, baUtil, Store) {

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
      stats: 0,
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
      stats: 0,
      icon: 'device'
    }];

    Store.findAll('hazard', { descending: true }, { raw: true }).then(function(resp) {
      var data = resp.meta;
      var allHazardCount = data.totalItems;
      var hazardEvents = $filter('filter')(data.items, { ishandled: false });
      var allNonAcknowledgedCount = hazardEvents.length;
      $scope.charts[0].stats = allNonAcknowledgedCount + ' / ' + allHazardCount;
    }).catch(function(err) {
      console.error("Fetching user's hazards is failed!");
    });

    Store.findAll('claim', {}, { raw: true }).then(function(resp) {
      var data = resp.meta;
      $scope.charts[1].stats = data.totalItems;
    }).catch(function(err) {
      console.error('Fetching claims has failed!');
    });

    Store.findAll('user', {}, { raw: true }).then(function(resp) {
      var data = resp.meta;
      $scope.charts[2].stats = data.totalItems;
    }).catch(function(err) {
      console.error('Fetching users is failed!');
    });

    Store.findAll('shield', {}, { raw: true }).then(function(resp) {
      var data = resp.meta;
      $scope.charts[3].stats = data.totalItems;
    }).catch(function(err) {
      console.error('Fetching user shields is failed!');
    });

    Store.findAll('device', {}, { raw: true }).then(function(resp) {
      var data = resp.meta;
      $scope.charts[4].stats = data.totalItems;
    }).catch(function(err) {
      console.error("Fetching user's devices is failed!");
    });

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function loadPieCharts() {
      $('.chart').each(function() {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function(from, to, percent) {
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

      $('.refresh-data').on('click', function() {
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

}());
