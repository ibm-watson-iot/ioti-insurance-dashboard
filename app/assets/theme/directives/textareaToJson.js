(function () {
  'use strict';

  angular.module('BlurAdmin.theme').directive('jsonText', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ngModel) {
        function into(input) {
          try {
            return JSON.parse(input);
          } catch (e) {
            return null;
          }
        }

        function out(data) {
          try {
            return JSON.stringify(data, null, 2);
          } catch (e) {
            return data;
          }
        }

        ngModel.$parsers.push(into);
        ngModel.$formatters.push(out);

      }
    };
  });
})();