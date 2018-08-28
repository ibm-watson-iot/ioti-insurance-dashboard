/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/


(function() {

  angular.module('BlurAdmin.theme').directive('ngClick', function($parse) {
    return {
      replace: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.ngClick);
        element.on('click', function(event) {
          scope.$apply(function() {
            var res = fn(scope, { $event: event }),
              before = null;
            if (res && res.finally) {
              attrs.$set('loading', true);
              attrs.$set('disabled', true);
              if (attrs.replaceWithLoader) {
                before = element.html();
                element.html('<i class="fa fa-refresh fa-spin"></i>');
              } else {
                element.append('<i class="fa fa-refresh fa-spin"></i>');
              }

              res.finally(function() {
                attrs.$set('disabled', false);
                attrs.$set('loading', false);
                element.find('.fa.fa-refresh.fa-spin').remove();
                if (attrs.replaceWithLoader) {
                  element.html(before);
                }
              });
            }
          });
        });
      }
    };
  });

}());

