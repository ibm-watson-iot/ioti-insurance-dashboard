'use strict';

angular.module('BlurAdmin.services').factory('notificationService', function(webSocketService, toastr) {
  return {
    enable: function() {
      // Let's check if the browser supports notifications
      var permission = false;
      if ("Notification" in window) {
        // Let's check whether notification permissions have already been granted
        if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          permission = true;
          // Otherwise, we need to ask the user for permission
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission(function (perm) {
            // If the user accepts, let's create a notification
            if (perm === "granted") {
              permission = true;
            }
          });
        }
      }

      webSocketService.on('push-notification', function (msg) {
        if (permission) {
          var notification = new Notification(msg.title, msg.options);
          notification.show();
          setTimeout(notification.close.bind(notification), 3000);
        } else {
          toastr.info(msg.title, msg.options.body, msg.options);
        }
      });
    }
  };
});
