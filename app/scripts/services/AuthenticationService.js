/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
'use strict';

angular.module('BlurAdmin.services').factory('authenticationService', function(
  $http, $httpParamSerializer, $q, $location, $window, jwtHelper, userService,
  apiProtocol, apiHost, apiPath, tenantId, toastr) {

  var tokenKey = $location.host() + '_' + $location.port() + '_' + 'dashboardAuthToken';
  var userKey = $location.host() + '_' + $location.port() + '_' + 'dashboardUser';
  var apiUrl = apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/';
  var nonDefaultPort = '';
  if ($location.port() !== 80) {
    nonDefaultPort = ':' + $location.port();
  }
  var redirectUrl = $location.protocol() + '://' + $location.host() + nonDefaultPort + '/';

  var authorizeCode = $q.resolve()
  .then(function () {
    var token = localStorage.getItem(tokenKey);
    var user = localStorage.getItem(userKey);

    if (token && user && !jwtHelper.isTokenExpired(token)) {
      return true;
    }

    var searchObject = $location.search();
    if (searchObject.code && searchObject.state) {
      return $http({
        url: apiUrl + 'token',
        method: 'POST',
        data: $httpParamSerializer({
          code: searchObject.code,
          state: searchObject.state,
          grant_type: 'authorization_code',
          redirect_uri: redirectUrl
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
        }
      });
    }

    return $q.reject();
  })
  .then(function(response) {
    if (response === true) {
      return JSON.parse(localStorage.getItem(userKey));
    }
    var token = response.data;
    localStorage.setItem(tokenKey, token.access_token);
    var authenticatedUser = jwtHelper.decodeToken(token.access_token);
    localStorage.setItem(userKey, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  })
  .then(function (authenticatedUser) {
    return userService.find(authenticatedUser.sub).catch(function(data) {
      if (data.status === 404) {
        authenticatedUser.address = {
          city: 'Munich'
        };
        authenticatedUser._id = authenticatedUser.sub;
        return userService.save(authenticatedUser).catch(function(data) {
          console.error("Saving new user is failed.", data);
        });
      } else {
        console.error("Fetching the authenticated user is failed.", data);
      }
    });
  })
  .then(function () {
    var expirationTime = jwtHelper.getTokenExpirationDate(localStorage.getItem(tokenKey));
    console.log('token will expire in ', (expirationTime - Date.now()) / 1000);
    setTimeout(function () {
      toastr.warning('Your session will expire in '+parseInt((expirationTime - Date.now())/(1000*60))+'min, at ' + expirationTime.toLocaleTimeString());
    }, expirationTime - Date.now() -  5*60*1000);
  });

  return {
    authenticate: function() {
      var query = {
        response_type: 'code',
        redirect_uri: redirectUrl,
        scope: 'shields:read',
        state: 'test'
      };
      $window.location.href = apiUrl + 'authorization?' + $httpParamSerializer(query);
    },
    isAuthenticated: function() {
      return authorizeCode.then(function() {
        return !!localStorage.getItem(tokenKey);
      });
    },
    isAdmin: function() {
      return authorizeCode.then(function() {
        if (localStorage.getItem(userKey)) {
          var user = JSON.parse(localStorage.getItem(userKey));
          if (user && user.accessLevel === '3') {
            return true;
          }
        }
        return false;
      });
    },

    getUser: function() {
      return JSON.parse(localStorage.getItem(userKey));
    },
    setUser: function(user) {
      localStorage.setItem(userKey, JSON.stringify(user));
    },
    getToken: function() {
      return localStorage.getItem(tokenKey);
    },
    setToken: function(token) {
      localStorage.setItem(tokenKey, token);
    },
    signOut: function() {
      localStorage.removeItem(userKey);
      localStorage.removeItem(tokenKey);
    }
  };
});
