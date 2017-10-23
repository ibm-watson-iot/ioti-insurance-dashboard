'use strict';

angular.module('BlurAdmin.utils').factory('gmapsHandler', function() {

  function addToMap(latLng, map) {
    map.setCenter(latLng);
    const infowindow = new google.maps.InfoWindow(
      {
        content: '<b>JSON.stringify(latLng)</b>',
        size: new google.maps.Size(150, 50)
      });
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: JSON.stringify(latLng)
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  }

  var map;

  return {
    showInMap: function(location) {
      if (location.type === 'address') {
        const geocoder = new google.maps.Geocoder();
        if (geocoder) {
          geocoder.geocode({ 'address': location.address }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
                addToMap({
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                }, map);
              } else {
                console.log("No results found");
              }
            } else {
              console.log('Geocode was not successful for the following reason:' + status);
            }
          });
        }
      } else if (location.type === 'latLng') {
        addToMap({
          lat: location.latLng.lat,
          lng: location.latLng.lng
        }, map);
      } else {
        console.log("Invalid location type");
      }
    },
    initGmaps: function() {
      // default center in the US
      const defaultCenter = new google.maps.LatLng(41.850033, -87.6500523);
      const myOptions = {
        zoom: 14,
        center: defaultCenter,
        mapTypeControl: true,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById("google-maps"), myOptions);
    }
  };
});
