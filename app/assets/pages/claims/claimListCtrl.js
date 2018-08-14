(function() {


  angular.module('BlurAdmin.pages.claims').controller('ClaimListCtrl', ClaimListCtrl);

  function ClaimListCtrl($timeout, baConfig, layoutPaths, cityLocationService, Store) {
    var vm = this;
    var latlong;
    vm.claims = Store.getLiveArray('claim');

    cityLocationService.me().then(function(result) {
      latlong = result.data;
      return Store.findAll('claim');
    }).then(function(result) {
      return Store.findAll('user');
    }).then(function() {
      var i, user, city, cityClaimCount = {};
      for (i = 0; i < vm.claims.length; i++) {
        user = vm.claims[i].user.value;
        city = user.address.city.replace(/\s+/g, '').toLowerCase();
        if (city) {
          if (!cityClaimCount[city]) {
            cityClaimCount[city] = 0;
          }
          cityClaimCount[city] += 1;
        }
      }
      var mapData = [];
      for (city in cityClaimCount) {
        mapData.push({
          name: city,
          value: cityClaimCount[city],
          code: city,
          color: baConfig.colors.primaryDark
        });
      }
      if (mapData.length > 0) {
        loadMap(mapData);
      }
    });

    function loadMap(mapData) {
      var map;
      var minBulletSize = 3;
      var maxBulletSize = 10;
      var min = Infinity;
      var max = -Infinity;

      // get min and max values
      for (var i = 0; i < mapData.length; i++) {
        var value = mapData[i].value;
        if (value < min) {
          min = value;
        }
        if (value > max) {
          max = value;
        }
      }

      AmCharts.theme = AmCharts.themes.blur;
      map = new AmCharts.AmMap();

      map.areasSettings = {
        unlistedAreasColor: '#000000',
        unlistedAreasAlpha: 0.1
      };
      map.imagesSettings.balloonText = '<span style="font-size:14px;"><b>[[title]]</b>: [[value]]</span>';
      map.pathToImages = layoutPaths.images.amMap;

      var dataProvider = {
        mapVar: AmCharts.maps.worldLow,
        images: []
      };
      // it's better to use circle square to show difference between values, not a radius
      var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
      var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

      // create circle for each country
      for (var i = 0; i < mapData.length; i++) {
        var dataItem = mapData[i];
        var value = dataItem.value;
        // calculate size of a bubble
        var square = (value - min) / (max - min) * (maxSquare - minSquare) + minSquare;
        if (square < minSquare) {
          square = minSquare;
        }
        var size = Math.sqrt(square / (Math.PI * 2));
        var id = dataItem.code.toLowerCase().replace(/\s/g, '');
        var latitude = latlong[id].lat;
        var longitude = latlong[id].lon;

        dataProvider.images.push({
          type: 'circle',
          width: size,
          height: size,
          color: dataItem.color,
          longitude: longitude,
          latitude: latitude,
          title: dataItem.name.capitalizeFirstLetter(),
          value: value
        });
      }

      map.dataProvider = dataProvider;
      map.export = {
        enabled: true
      };

      $timeout(function() {
        map.write('map-bubbles');
      }, 100);
    }

  }

}());
