/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardLineChartCtrl', DashboardLineChartCtrl);

  /** @ngInject */
  function DashboardLineChartCtrl(baConfig, layoutPaths, baUtil) {
    var layoutColors = baConfig.colors;
    var graphColor = baConfig.theme.blur ? '#000000' : layoutColors.primary;
    var users = [];

    // Standard Normal variate using Box-Muller transform.
    function randn_bm(month) {
      var max = 12;
      var min = month % 12 + 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    for(var i=0;i < 10000; i++) {
        var user = {
          registered_at: new Date(2016, Math.floor(randn_bm(i))+1)
        }
        users.push(user);
    }

    var chartData = [];
    for (var i=1; i<13; i++) {
      var result = users.filter(function(user) {
        return user.registered_at <= new Date(2016, i);
      });
      chartData.push({
        date: new Date(2016, i),
        value: result.length
      });
    }

    var startDate;
    var monthCount = 12;

    _.each(chartData, function(item){
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - monthCount);
      item.date = startDate;
      monthCount--;
    });

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
  }
})();
