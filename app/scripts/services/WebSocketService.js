'use strict';

angular.module('BlurAdmin.services').factory('webSocketService', function(
  $rootScope, backendProtocol, backendHost, backendWebSocketPath, customerICN, NPStest, authenticationService) {
  var service = {
    registry: {},
    websocket: null,

    on: function (event, callback) {
      if (!this.registry[event]) {
        this.registry[event] = [];
      }
      this.registry[event].push(callback);
    },

    removeEventListener: function (event, callback) {
      if (this.registry[event]) {
        var index = this.registry[event].indexOf(callback);
        this.registry[event].splice(index, 1);
      }
    },

    init: function () {
      if (backendProtocol === 'https') {
        backendProtocol = 'wss';
      } else {
        backendProtocol = 'ws';
      }
      var apiUrl = backendProtocol + "://" + backendHost + backendWebSocketPath;
      this.websocket = new WebSocket(apiUrl);

      // When the connection is open, send some data to the server
      this.websocket.onopen = function () {
        console.log('websocket open');

        // do not give away details about users here 
        //console.log('Logged in user: ' + JSON.stringify($rootScope.loggedInUser));
        var firstName = '', lastName = '', npsTest = false;

        if ($rootScope.loggedInUser.firstName) firstName = decodeURIComponent($rootScope.loggedInUser.firstName);
        if ($rootScope.loggedInUser.lastName) lastName = decodeURIComponent($rootScope.loggedInUser.lastName);
        if (NPStest === 'yes') npsTest = true;
        console.log('NPS test: ' + NPStest + '  ' + npsTest);
        window.IBM_Meta = {
          // info about offering
          offeringId:"5900A0O",
          offeringName:"IBM IoT for insurance",
          highLevelOfferingName:"Watson IoT",

          // end user specific stuff
          userFirstName:firstName,
          userLastName:lastName,
          userEmail:$rootScope.loggedInUser.sub,
          userId:$rootScope.sub,
          userIdType:"GBS",
          country:"US",
          excludeUser:"no",
          daysSinceFirstLogin: window.Medallia.daysSinceFirstLogin,

          // customer specific
          iuid:"",
          customerName:"IBM",
          icn:customerICN,
          customerSize:"large",
          usFederalAccount:"no",

          // session specific
          language:"en",
          testData:npsTest,
          quarterlyIntercept:"heavy",
          noQuarantine:"yes"
        };
        loadScript("https://nebula-cdn.kampyle.com/we/28600/onsite/embed.js", loadScriptCb);

        this.websocket.send(JSON.stringify({userId: authenticationService.getUser().sub, isInsurer: true}));
      }.bind(this);

      // Log errors
      this.websocket.onerror = function (error) {
        console.log('WebSocket Error ' + error);
      }.bind(this);

      this.websocket.onmessage = function (e) {
        var data = JSON.parse(e.data);
        if (this.registry[data.event]) {
          this.registry[data.event].forEach(function (callback) {
            callback(data);
          });
        }
      }.bind(this);
    }
  };

  service.init();


  return service;
});
