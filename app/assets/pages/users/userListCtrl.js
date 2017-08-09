/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.users').controller('UserListCtrl', UserListCtrl);

function UserListCtrl($scope, $timeout, baConfig, layoutPaths, userService, cityLocationService) {
  var vm = this;
  var latlong;
  vm.users = [];
  vm.isLoading = true;

  $scope.$watch("userListCtrlVm.currentPage", function() {
    vm.paginatedUsers = vm.users.slice((vm.currentPage-1)*vm.itemsPerPage, (vm.currentPage-1)*vm.itemsPerPage+vm.itemsPerPage);
  });

  cityLocationService.me().success(function(data) {
    latlong = data;

    userService.findAll().success(function(data) {
      vm.isLoading = false;
      vm.users = data.items;
      vm.paginatedUsers = vm.users.slice(0, 10);
      vm.totalItems = data.totalItems;
      vm.currentPage = 1;
      vm.itemsPerPage = 10;

      var cityUserCount = {};
      _.each(vm.users, function(user) {
        var city = user.address.city;
        if (city) {
          if (!cityUserCount[city]) {
            cityUserCount[city] = 0;
          }
          cityUserCount[city] = cityUserCount[city] + 1;
        }
      });
      var mapData = [];
      for (var city in cityUserCount) {
        var mapDataEntry = {};
        mapDataEntry.name = city;
        mapDataEntry.value = cityUserCount[city];
        mapDataEntry.code = city;
        mapDataEntry.color = baConfig.colors.primaryDark;
        mapData.push(mapDataEntry);
      }
      if (mapData.length > 0) {
        loadMap(mapData);
      }
    }).error(function(err) {
      console.error("Fetching all users failed!");
    });
  }).error(function(err) {
    console.error("Fetching city locations failed!");
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

    // build map
    AmCharts.theme = AmCharts.themes.blur;
    map = new AmCharts.AmMap();

    //map.addTitle('Users ', 14);
    //map.addTitle('source: Gapminder', 11);
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
      var id = dataItem.code.toLowerCase().replace(/\s/g, '');;
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

})();
