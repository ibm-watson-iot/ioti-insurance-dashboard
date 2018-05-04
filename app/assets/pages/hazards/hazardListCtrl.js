/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.hazards').controller('HazardListCtrl', HazardListCtrl);

  function HazardListCtrl(
    $filter, $scope, editableThemes, toastr, baConfig, cityLocationService, layoutPaths,
    webSocketService, $timeout, Store
  ) {
    var vm, latlong;
    vm = this;
    vm.hazards = [];
    vm.isLoading = true;
    vm.currentPage = 1;
    latlong = {};

    vm.liveHazards = Store.getLiveArray('hazard');
    $scope.$watch('hazardListCtrlVm.liveHazards.length', function() {

    });

    $scope.$watch('[hazardListCtrlVm.liveHazards.length,hazardListCtrlVm.currentPage]', function() {
      var start = ((vm.currentPage - 1) * vm.itemsPerPage) - vm.itemsOffset;
      var end = ((vm.currentPage - 1) * vm.itemsPerPage) + (vm.itemsPerPage - vm.itemsOffset);
      vm.hazards = $filter('orderBy')(vm.liveHazards, 'createdAt', true);
      vm.paginatedHazards = vm.hazards.slice(start, end);
    });

    vm.acknowledgeHazard = function(hazard) {
      hazard.ishandled = true;
      hazard.save().then(function(data) {
        toastr.success('Acknowledged.');
      }).catch(function(err) {
        toastr.error('Saving hazard is failed! ' + err, 'Error');
      });
    };

    function updateHazardsInfo() {
      var cityHazardCount, usersPromises;
      cityHazardCount = {};
      usersPromises = vm.hazards.map(function(hazard) {
        return hazard.user;
      });
      Promise.all(usersPromises).then(function() {
        vm.hazards.forEach(function(hazard) {
          var userInfo = hazard.user.value;
          var cityId = userInfo.address.city.replace(/\s+/g, '').toLowerCase();
          if (userInfo) {
            if (!cityHazardCount[cityId]) {
              cityHazardCount[cityId] = 0;
            }
            cityHazardCount[cityId] += 1;
          }
          // populate the map data
          var mapData = Object.keys(cityHazardCount).map(function(city) {
            var mapDataEntry = {};
            mapDataEntry.name = city;
            mapDataEntry.value = cityHazardCount[city];
            mapDataEntry.code = city;
            mapDataEntry.color = baConfig.colors.primaryDark;
            return mapDataEntry;
          });

          if (mapData.length > 0) {
            loadMap(mapData);
          }
        });
      });
    }

    function getHazards(offset) {
      vm.isLoading = true;
      Store.findAll('hazard', { descending: true, skip: offset }, { raw: true }).then(function(res) {
        vm.isLoading = false;
        vm.paginatedHazards = vm.hazards.slice(0, 10);
        vm.totalItems = res.meta.totalItems;
        vm.itemsPerPage = 10;
        vm.itemsOffset = offset;
        vm.itemLengthLimit = res.meta.limit;

        updateHazardsInfo();
      }).catch(function(err) {
        console.error('Fetching all hazards has failed!');
      });
    }

    cityLocationService.me().success(function(data) {
      latlong = data;
      getHazards(0);
    }).error(function(err) {
      console.error('Fetching city locations failed!');
    });

    vm.saveHazard = function(hazard) {
      hazard.save().then(function() {
        toastr.success(null, 'Saving hazard is successful.');
      }).catch(function(err) {
        console.error('Saving hazard has failed!');
        toastr.error('Saving hazard has failed!', 'Error');
      });
    };

    webSocketService.on('new-hazard', function(notification) {
      notification.data.createdAt = notification.data.createdAt || Date.now();
      Store.createRecord('hazard', notification.data);
      updateHazardsInfo();
    });


    $scope.$on('$destroy', function() {
      webSocketService.removeEventListener('new-hazard', getHazards);
    });

    editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes.bs3.cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

    function loadMap(mapData) {
      var maxBulletSize, minBulletSize, map, i, value, min, max;
      minBulletSize = 3;
      maxBulletSize = 10;
      min = Infinity;
      max = -Infinity;

      // get min and max values
      for (i = 0; i < mapData.length; i++) {
        value = mapData[i].value;
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
      for (i = 0; i < mapData.length; i++) {
        var dataItem = mapData[i];
        value = dataItem.value;
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

    vm.pageChanged = function() {
      var offset = parseInt((vm.currentPage - 1) * vm.itemsPerPage / vm.itemLengthLimit) * vm.itemLengthLimit;
      if (offset !== vm.itemsOffset) {
        if (vm.nextItemLoad) {
          clearTimeout(vm.nextItemLoad);
        }
        vm.isLoading = true;
        vm.nextItemLoad = setTimeout(function() {
          getHazards(offset);
          vm.nextItemLoad = null;
        }, 1000);
      }
    };
  }

}());
