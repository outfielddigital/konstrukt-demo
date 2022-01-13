// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function listViewController($scope, $routeParams, $location, appState, navigationService, konstruktResource, konstruktUtils) {

        // Parse the id route param
        $scope.sectionAlias = appState.getSectionState("currentSection");
        $scope.collectionAlias = $routeParams.id;

        $scope.page = {};
        $scope.page.loading = false;
        $scope.page.menu = {};
        $scope.page.menu.currentNode = null;
        $scope.page.menu.currentSection = $scope.sectionAlias;

        $scope.page.breadcrumb = {};
        $scope.page.breadcrumb.items = [];
        $scope.page.breadcrumb.itemClick = function (ancestor) {
            $location.path(ancestor.routePath);
        };

        function init(collection) {
            $scope.page.name = collection.namePlural;
        }

        function syncTree(entity, path, initialLoad) {
            navigationService.syncTree({ tree: entity.collectionSourceAlias, path: path.split(","), forceReload: initialLoad !== true }).then(function (syncArgs) {
                $scope.page.menu.currentNode = syncArgs.node;
                $scope.page.breadcrumb.items = konstruktUtils.createBreadcrumbFromTreeNode(syncArgs.node);
            });
        }

        $scope.page.loading = true;

        $scope.onCollectionLoaded = function (collection) {
            init(collection);
            syncTree(collection, collection.path, true);
            $scope.page.loading = false;
        };

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.ListViewController", listViewController);

})();