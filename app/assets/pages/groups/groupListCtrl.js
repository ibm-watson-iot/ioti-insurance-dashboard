/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.groups').controller('GroupListCtrl', GroupListCtrl);

  function GroupListCtrl($rootScope, $uibModal, editableThemes, toastr, Store) {
    var vm = this;
    vm.allGroups = [];

    Store.findAll('attributes').then(function(items) {
      vm.allGroups = items.filter(function(item) {
        return item.type === 'group';
      });
    });

    vm.deleteGroup = function(group) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'pages/groups/group-delete.html',
        controller: 'GroupDeleteCtrl',
        size: 'sm',
        resolve: {
          group: function() {
            return group;
          }
        }
      });
      return modalInstance.result.then(function(groupToDelete) {
        return Store.destroy('group', groupToDelete._id);
      }, function() {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    vm.saveGroup = function(group) {
      return group.save();
    };
  }

}());
