(function() {
  'use strict';

  angular.module('BlurAdmin.pages.claims').controller('ClaimViewCtrl', ClaimViewCtrl);

  function ClaimViewCtrl($stateParams, claimService, userService) {
    var vm = this;
    vm.claim = {};

    if ($stateParams.claimId) {
      claimService.find($stateParams.claimId).success(function(claim) {
        vm.claim = claim;
        userService.find(vm.claim.userId).success(function(user) {
          vm.user = user;
          initializeLocationMap(user.address.street + ", " + user.address.zipcode
                            + " " + user.address.city + ", " + user.address.country);
        });
      });
    }

    function initializeLocationMap(address) {
      var map;
      var geocoder = new google.maps.Geocoder();
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
