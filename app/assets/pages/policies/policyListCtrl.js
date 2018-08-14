/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function() {


  angular.module('BlurAdmin.pages.policies').controller('PolicyListCtrl', PolicyListCtrl);

  function PolicyListCtrl($rootScope, $uibModal, editableThemes, toastr, Store) {
    var vm = this;
    vm.allPolicies = [];

    Store.findAll('policy').then(function(items) {
      vm.allPolicies = items;
    }).catch(function(err) {
      console.error('Fetching all policies has failed!');
    });

    vm.deletePolicy = function(policy) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'pages/policies/policy-delete.html',
        controller: 'PolicyDeleteCtrl',
        size: 'sm',
        resolve: {
          policy: function() {
            return policy;
          }
        }
      });
      return modalInstance.result.then(function(policyToDelete) {
        return Store.destroy('policy', policyToDelete._id);
      }, function() {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    vm.savePolicy = function(policy) {
      return policy.save();
    };
  }

}());
