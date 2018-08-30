/**
 * @author f.ulusoy
 * created on 27.01.2017
 */


angular.module('BlurAdmin.services').factory('authenticationService', function(
  $http, $httpParamSerializer, $q, $location, $window, jwtHelper, $injector,
  apiProtocol, apiHost, apiPath, authCallbackPath, tenantId, toastr, $uibModal
) {

  var currentUser = null;
  var tokenKey = $location.host() + '_' + $location.port() + '_' + 'dashboardAuthToken';
  var userKey = $location.host() + '_' + $location.port() + '_' + 'dashboardUser';
  var apiUrl = apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/';
  var nonDefaultPort = '';
  if (($location.protocol() === 'http' && $location.port() !== 80) ||
    ($location.protocol() === 'https' && $location.port() !== 443)) {
    nonDefaultPort = ':' + $location.port();
  }
  // allow for non standard auth callback paths
  //        to specify authorized redirection URL, for example /auth/sso/callback as configured in w3id auth service for localhost
  var redirectUrl = $location.protocol() + '://' + $location.host() + nonDefaultPort + authCallbackPath;

  var authorizeCode = $q.resolve()
    .then(function() {
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
      authenticatedUser.uniqueSecurityID = authenticatedUser.sub; /*authenticatedUser.uniqueSecurityName TODO: need to align dashboards */
      localStorage.setItem(userKey, JSON.stringify(authenticatedUser));
      return authenticatedUser;
    })
    .then(function(authenticatedUser) {
      var Store = $injector.get('Store');
      return Store.find('user', authenticatedUser.uniqueSecurityID).catch(function(err) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'pages/modals/prompt/prompt.html',
          controller: 'ModalPromptCtrl',
          size: 'sm',
          resolve: {
            cannotCancel: true,
            title: function() {
              return 'Access denied';
            },
            message: function() {
              return 'Ask your manager to provide you access to this dashboard. Your ID: "' + authenticatedUser.uniqueSecurityID + '"';
            }
          }
        });
        return modalInstance.result.then(function() {
          throw err;
        });
      });
    })
    .then(function(data) {
      currentUser = data;
      window.Medallia.daysSinceFirstLogin = Math.round((Date.now() - data.createdAt) / 86400000);
      console.log('New login: daysSinceFirstLogin is ' + window.Medallia.daysSinceFirstLogin);
      var expirationTime = jwtHelper.getTokenExpirationDate(localStorage.getItem(tokenKey));
      console.log('token will expire in ', (expirationTime - Date.now()) / 1000);
      setTimeout(function() {
        toastr.warning('Your session will expire in ' + parseInt((expirationTime - Date.now()) / (1000 * 60)) + 'min, at ' + expirationTime.toLocaleTimeString());
      }, expirationTime - Date.now() - 5 * 60 * 1000);
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
    isStillAuthenticated: function() {
      return !!localStorage.getItem(tokenKey);
    },
    isAuthenticated: function() {
      return authorizeCode.then(function() {
        return !!localStorage.getItem(tokenKey);
      });
    },
    isAdmin: function() {
      return authorizeCode.then(function() {
        if (localStorage.getItem(userKey)) {
          if (currentUser && currentUser.accessLevel == '3') {
            return true;
          }
        }
        return false;
      });
    },

    getUser: function() {
      return currentUser;
    },
    getTokenUser: function() {
      return JSON.parse(localStorage.getItem(userKey));
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
