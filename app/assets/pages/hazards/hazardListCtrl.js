/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.hazards').controller('HazardListCtrl', HazardListCtrl);

function HazardListCtrl($filter, $scope, editableThemes, toastr, baConfig, cityLocationService, layoutPaths,
                        hazardService, shieldService, webSocketService, userService, $timeout) {
  var vm = this;
  vm.hazards = [];
  vm.isLoading = true;
  vm.uuidToShieldMap = {};
  var latlong = {};

  $scope.$watch("hazardListCtrlVm.currentPage", function() {
    vm.paginatedHazards = vm.hazards.slice((vm.currentPage-1)*vm.itemsPerPage, (vm.currentPage-1)*vm.itemsPerPage+vm.itemsPerPage);
  });

  vm.acknowledgeHazard = function(hazard) {
    hazard.ishandled = true;
    hazardService.updatePartial(hazard._id, { ishandled: true }).success(function(data) {
      toastr.success("Acknowledged.");
    }).error(function(err) {
      toastr.error("Saving hazard is failed!", "Error");
    });
  };

  function getHazards() {
    hazardService.findAll().then(function(res) {
      vm.isLoading = false;
      vm.hazards = $filter('orderBy')(res.data.items, 'createdAt');
      vm.paginatedHazards = vm.hazards.slice(0, 10);
      vm.totalItems = res.data.totalItems;
      vm.currentPage = 1;
      vm.itemsPerPage = 10;

      var cityHazardCount = {};
      _.each(vm.hazards, function(hazard) {
        var userInfo = vm.userMap[hazard.userId];
        if (userInfo) {
          if (!cityHazardCount[userInfo.cityId]) {
            cityHazardCount[userInfo.cityId] = 0;
          }
          cityHazardCount[userInfo.cityId] = cityHazardCount[userInfo.cityId] + 1;
        } else {
          vm.userMap[hazard.userId] = {
            customer: '-',
            cityName: '-',
            cityId: '-'
          };
        }
      });
      // populate the map data
      var mapData = [];
      for (var city in cityHazardCount) {
        var mapDataEntry = {};
        mapDataEntry.name = city;
        mapDataEntry.value = cityHazardCount[city];
        mapDataEntry.code = city;
        mapDataEntry.color = baConfig.colors.primaryDark;
        mapData.push(mapDataEntry);
      }

      if (mapData.length > 0) {
        loadMap(mapData);
      }
    }).catch(function(err) {
      console.error("Fetching all hazards has failed!");
    });
  }

  cityLocationService.me().success(function(data) {
    latlong = data;

    // get all users and cash user location
    userService.findAll().success(function(data) {
      var allUsers = data.items;
      vm.userMap = {};
      _.each(allUsers, function(user) {
        if (!user.address) {
          console.warn('user ' + user.name + ' does not have an address');
        }
        var city = user.address.city;
        vm.userMap[user._id] = {
          name: user.name,
          cityName: city,
          cityId: city.replace(/\s+/g, '').toLowerCase()
        };
      });

      getHazards();

    }).error(function(err) {
      console.error("Fetching all users failed!");
    });
  }).error(function(err) {
    console.error("Fetching city locations failed!");
  });

  shieldService.findAll().success(function(data) {
    _.each(data.items, function(shield) {
      vm.uuidToShieldMap[shield._id] = shield;
    });
  }).error(function(err) {
    console.error("Fetching all shields has failed!");
  });

  vm.saveHazard = function(hazard) {
    hazardService.save(hazard).success(function(savedHazard) {
      _.merge(hazard, savedHazard);
      toastr.success(null, "Saving hazard is successful.");
    }).error(function(err) {
      console.error("Saving hazard has failed!");
      toastr.error("Saving hazard has failed!", "Error");
    });
  };

  webSocketService.on('new-hazard', getHazards);


  $scope.$on('$destroy', function () {
    webSocketService.removeEventListener('new-hazard', getHazards);
  });


  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

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

    //map.addTitle('Hazards ', 14);
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
      var id = dataItem.code.toLowerCase().replace(/\s/g, '');
      if (!latlong[id]) {
        continue;
      }
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
