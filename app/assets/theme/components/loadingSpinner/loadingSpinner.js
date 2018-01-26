/**
 * Created by n.poltoratsky
 * on 28.06.2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('loadingSpinner', loadingSpinner);

    /** @ngInject */
    function loadingSpinner() {
        return {
            restrict: 'E',
            templateUrl: 'theme/components/loadingSpinner/loadingSpinner.html',
            link:function($scope, element, attrs) {
              $scope.type = attrs.type || 'circle';
            }
        }
    }
})();