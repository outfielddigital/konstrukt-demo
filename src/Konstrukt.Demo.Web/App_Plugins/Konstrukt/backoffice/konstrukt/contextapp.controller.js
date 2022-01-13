// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital
// - Licensed under the PolyForm Shield License 1.0.0
//   https://polyformproject.org/licenses/shield/1.0.0/

(function () {

    'use strict';

    function contextAppController($scope, appState, navigationService, konstruktResource) {
        
        var vm = this;
        
        vm.contextAppAlias = $scope.model.alias;
        vm.nodeUdi = $scope.model.viewModel.nodeUdi;
        vm.tabs = [];
        
        vm.loading = false;

        vm.changeTab = function (tabs, selectedTab) { 
            tabs.forEach(function (tab) {
                tab.active = false;
            });
            selectedTab.active = true;
        };
        
        konstruktResource.getContextAppCollections($scope.model.alias).then(function(data) {
            vm.tabs = data.map((itm, idx) => {
                return {
                    "id": idx,
                    "active": idx === 0,
                    "label": itm.namePlural,
                    "alias": itm.alias,
                    "collection": itm
                };
            });
            vm.loading = true;
        });

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.ContextAppController", contextAppController);

})();