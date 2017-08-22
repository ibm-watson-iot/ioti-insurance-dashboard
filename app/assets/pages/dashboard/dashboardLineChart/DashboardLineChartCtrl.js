/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .controller('DashboardLineChartCtrl', DashboardLineChartCtrl);

  /** @ngInject */
  function DashboardLineChartCtrl(baConfig, layoutPaths, baUtil, userService) {
    var layoutColors = baConfig.colors;
    var graphColor = baConfig.theme.blur ? '#000000' : layoutColors.primary;
    var users = [];

    userService.findAll().success(function(data) {
      users = data.items;
      var chartData = [];
      for (var i=12; i>=0; i--) {
        var date = new Date();
        var result = users.filter(function(user) {
          return user.createdAt <= new Date(date.getFullYear(), date.getMonth() + 1 - i);
        });
        chartData.push({
          date: new Date(new Date().getFullYear(), date.getMonth() - i),
          value: result.length
        });
      }

      var chart = AmCharts.makeChart('amchart', {
        type: 'serial',
        theme: 'blur',
        marginTop: 15,
        marginRight: 15,
        dataProvider: chartData,
        categoryField: 'date',
        categoryAxis: {
          parseDates: true,
          gridAlpha: 0,
          color: layoutColors.defaultText,
          axisColor: layoutColors.defaultText
        },
        valueAxes: [
          {
            minVerticalGap: 50,
            gridAlpha: 0,
            color: layoutColors.defaultText,
            axisColor: layoutColors.defaultText,
            title: 'Users'
          }
        ],
        graphs: [
          {
            id: 'g1',
            bullet: 'none',
            useLineColorForBulletBorder: true,
            lineColor: baUtil.hexToRGB(graphColor, 0.5),
            lineThickness: 1,
            negativeLineColor: layoutColors.danger,
            type: 'smoothedLine',
            valueField: 'value',
            fillAlphas: 1,
            fillColorsField: 'lineColor'
          }
        ],
        chartCursor: {
          categoryBalloonDateFormat: 'MM YYYY',
          categoryBalloonColor: '#4285F4',
          categoryBalloonAlpha: 0.7,
          cursorAlpha: 0,
          valueLineEnabled: true,
          valueLineBalloonEnabled: true,
          valueLineAlpha: 0.5
        },
        dataDateFormat: 'MM YYYY',
        export: {
          enabled: true
        },
        creditsPosition: 'bottom-right',
        zoomOutButton: {
          backgroundColor: '#fff',
          backgroundAlpha: 0
        },
        zoomOutText: '',
        pathToImages: layoutPaths.images.amChart
      });

      function zoomChart() {
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        chart.zoomToDates(startDate, new Date());
      }

      chart.addListener('rendered', zoomChart);
      zoomChart();
      if (chart.zoomChart) {
        chart.zoomChart();
      }
    });
  }
})();
