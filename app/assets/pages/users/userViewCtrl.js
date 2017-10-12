(function() {
'use strict';

angular.module('BlurAdmin.pages.users').controller('UserViewCtrl', UserViewCtrl);

function UserViewCtrl($stateParams, userService, shieldService, shieldActivationService,
  deviceService, hazardService, claimService) {
  var vm = this;
  vm.user = {};
  vm.uuidToShieldMap = {};
  vm.userShields = [];

  if ($stateParams.userId) {
    shieldService.findAll().success(function(data) {
      _.each(data.items, function(shield) {
        vm.uuidToShieldMap[shield._id] = shield;
        if (shield.needsActivationCheck !== true) {
          vm.userShields.push({ shieldId: shield._id });
        }
      });
    }).error(function(err) {
      console.error("Fetching all shields has failed!");
    });

    userService.find($stateParams.userId).success(function(user) {
      vm.user = user;
      initializeLocationMap(user.address.street + ", " + user.address.zipcode + " " + user.address.city + ", " + user.address.country);
      shieldActivationService.findAll({userId: $stateParams.userId}).success(function(data) {
        vm.userShields = vm.userShields.concat(data.items);
      });

      deviceService.findAll({userId: $stateParams.userId}).success(function(data) {
        vm.userDevices = data.items;
      });

      hazardService.findAll({descending: true, userId: $stateParams.userId}).success(function(data) {
        vm.userHazards = data.items;
      });

      claimService.findAll({userId: $stateParams.userId}).success(function(data) {
        vm.userClaims = data;
      }).error(function(err) {
        vm.userClaims = [];
        console.log('Failed to retrieve claims !');
      });
    });
  }

  function initializeLocationMap(address) {
    var geocoder;
    var map;

    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 14,
      center: latlng,
      mapTypeControl: true,
      mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
      navigationControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("google-maps"), myOptions);
    if (geocoder) {
      geocoder.geocode({'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            map.setCenter(results[0].geometry.location);
            var infowindow = new google.maps.InfoWindow(
              {
                content: '<b>' + address + '</b>',
                size: new google.maps.Size(150, 50)
              });
            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              title: address
            });
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });
          } else {
            console.log("No results found");
          }
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
      });
    }

  }
}

})();
