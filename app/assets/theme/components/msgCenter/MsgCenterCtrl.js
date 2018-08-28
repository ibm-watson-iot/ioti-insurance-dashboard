/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {


  angular.module('BlurAdmin.theme.components').controller('MsgCenterCtrl', MsgCenterCtrl);

  function MsgCenterCtrl($scope, $filter, $interval, toastr, Store, webSocketService) {

    function getHazards() {
      Store.findAll('hazard', { descending: true }, { force: true }).then(function(data) {
      // TODO: remove this hack when we have proper timestamps.
        _.each(data, function(hazard) {
          if (hazard.ishandled === 'true') {
            hazard.ishandled = true;
          }
        });
        data = $filter('filter')(data, { ishandled: undefined });
        $scope.hazards = $filter('orderBy')(data, 'createdAt', true);
      }).catch(function(err) {
        console.error('Fetching all hazards is failed!');
      });
    }

    function getClaims() {
      Store.findAll('claim').then(function(data) {
        _.each(data, function(claim) {
          claim.eventTime = new Date(claim.damageDate);
        });
        $scope.claims = data;
      }).catch(function(err) {
        console.error('Fetching all claims is failed!');
      });
    }

    getHazards();
    getClaims();

    webSocketService.on('new-hazard', getHazards);


    $scope.$on('$destroy', function() {
      webSocketService.removeEventListener('new-hazard', getHazards);
    });

    $scope.acknowledgeAll = function() {
      _.each($scope.hazards, function(hazard) {
        hazard.ishandled = true;
        hazard.save();
      });
    };


    $scope.users = {
      0: {
        name: 'Vlad',
      },
      1: {
        name: 'Kostya',
      },
      2: {
        name: 'Andrey',
      },
      3: {
        name: 'Nasta',
      }
    };

    $scope.messages = [
      {
        userId: 3,
        text: 'After you get up and running, you can place Font Awesome icons just about...',
        time: '1 min ago'
      },
      {
        userId: 0,
        text: 'You asked, Font Awesome delivers with 40 shiny new icons in version 4.2.',
        time: '2 hrs ago'
      },
      {
        userId: 1,
        text: 'Want to request new icons? Here\'s how. Need vectors or want to use on the...',
        time: '10 hrs ago'
      },
      {
        userId: 2,
        text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
        time: '1 day ago'
      },
      {
        userId: 3,
        text: 'Get to know who we are - from the inside out. From our history and culture, to the...',
        time: '1 day ago'
      },
      {
        userId: 1,
        text: 'Need some support to reach your goals? Apply for scholarships across a variety of...',
        time: '2 days ago'
      },
      {
        userId: 0,
        text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
        time: '1 week ago'
      }
    ];

  }

}());
