'use strict';

angular.module('BlurAdmin.services').factory('webSocketService', function(
  $rootScope, backendProtocol, backendHost, backendWebSocketPath, customerICN, authenticationService, toastr) {
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
        var firstName = '', lastName = '', email = '', idType = 'w3id authenticated user';

        // customerICN and email are required
        if (customerICN != 'customerICN' && customerICN != '999999') {
          if ($rootScope.loggedInUser.sub) {
            email = $rootScope.loggedInUser.sub;
            // valid email ?
            if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
              email = '';
          }
          if ($rootScope.loggedInUser.firstName) firstName = decodeURIComponent($rootScope.loggedInUser.firstName);
          if ($rootScope.loggedInUser.lastName) lastName = decodeURIComponent($rootScope.loggedInUser.lastName);
        }

        window.IBM_Meta = {
          // info about offering
          offeringId:"5900A0O",
          offeringName:"IBM IoT for insurance",
          highLevelOfferingName:"Watson IoT",

          // end user specific stuff
          userFirstName:firstName,
          userLastName:lastName,
          userEmail:email,
          userId:email,
          userIdType:idType,
          country:"US",
          excludeUser:"no",
          daysSinceFirstLogin: window.Medallia.daysSinceFirstLogin,

          // customer specific
          iuid:"",
          customerName:"",
          icn:customerICN,
          customerSize:"large",
          usFederalAccount:"no",

          // session specific
          language:"en",
          testData:true,
          quarterlyIntercept:"heavy",
          noQuarantine:"yes"
        };
        console.log('META is: ' + JSON.stringify(window.IBM_Meta));
        if (email != '')
          loadScript("https://nebula-cdn.kampyle.com/we/28600/onsite/embed.js", loadScriptCb);
        else
          toastr.warning('NPS not enabled ! Please see the ReadMe\'s NPS section how to do this');

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
