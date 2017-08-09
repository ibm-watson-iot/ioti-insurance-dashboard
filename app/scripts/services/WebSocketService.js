'use strict';

angular.module('BlurAdmin.services').factory('webSocketService', function(
  backendProtocol, backendHost, backendWebSocketPath, authenticationService) {
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
