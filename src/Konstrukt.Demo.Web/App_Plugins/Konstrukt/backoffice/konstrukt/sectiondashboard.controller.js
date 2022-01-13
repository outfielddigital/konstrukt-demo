// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function sectionDashboardController($scope, appState, navigationService, konstruktResource) {

        var currentSectionAlias = appState.getSectionState("currentSection");

        // Sync tree to tree root
        konstruktResource.getSectionByAlias(currentSectionAlias).then(function (data) {
            navigationService.syncTree({ tree: data.treeAlias, path: ["-1"], forceReload: false });
        });

        // Get summary types
        konstruktResource.getSectionDashboardCollections(currentSectionAlias).then(function (data) {
            $scope.collections = data.map(function (itm) {
                itm.entityCount = "-";
                return itm;
            });

            if ($scope.collections.length > 0) {
                loadNextEntityCount(0);
            }
        });

        // Get total record counts
        function loadNextEntityCount(idx) {
            konstruktResource.getEntityCount($scope.collections[idx].alias).then(function (count) {
                $scope.collections[idx].entityCount = count;
                if (idx < $scope.collections.length - 1) {
                    loadNextEntityCount(++idx);
                }
            });
        }

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.SectionDashboardController", sectionDashboardController);

})();