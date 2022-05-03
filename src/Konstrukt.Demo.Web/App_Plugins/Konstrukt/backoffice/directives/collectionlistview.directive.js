// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktCollectionListView($location, konstruktResource, editorService) {

        function link($scope, el, attr, ctrl) {
            
            $scope.showCreateButton = angular.isDefined($scope.showCreateButton) ? $scope.showCreateButton : true;

            $scope.listView = {
                options: {
                    isSearchable: true,
                    pageSize: 10,
                    defaultOrderBy: "Name",
                    defaultOrderDirection: "desc",
                    bulkActions: [],
                    dataViews: [],
                    layouts: [],
                    properties: [],
                    showCreateButton: $scope.showCreateButton
                },
                getItems: function (id, options) {
                    return $scope.parentEntityId
                        ? konstruktResource.getChildEntities($scope.collection.alias, $scope.parentEntityId, options)
                        : konstruktResource.getEntities($scope.collection.alias, options);
                },
                onItemClick: function (item) {
                    if ($scope.openInInfiniteEditor) {
                        editorService.open({
                            collectionAlias: item.collectionAlias,
                            id: item.id,
                            parentId: $scope.parentEntityId,
                            submit: function (model) {
                                $scope.$broadcast("konstrukt.reloadListView");
                                //editorService.close();
                            },
                            close: function () {
                                editorService.close();
                            },
                            view: "/App_Plugins/Konstrukt/backoffice/konstrukt/edit.html"
                        });
                    } else {
                        $location.path(item.editPath);
                    }
                },
                onAction: function (action, ids, settings) {
                    return konstruktResource.performAction($scope.collection.alias, action.type, action.alias, ids, settings, action.resultType);
                },
                onItemCreate: function () {
                    if ($scope.openInInfiniteEditor) {
                        editorService.open({
                            collectionAlias: $scope.collection.alias,
                            id: "0",
                            parentId: $scope.parentEntityId,
                            submit: function (model) {
                                $scope.$broadcast("konstrukt.reloadListView");
                                //editorService.close();
                            },
                            close: function () {
                                editorService.close();
                            },
                            view: "/App_Plugins/Konstrukt/backoffice/konstrukt/edit.html"
                        });
                    } else {
                        $location.path("/" + $scope.collection.collectionSourceAlias + "/konstrukt/edit/" + $scope.collection.alias);
                    }
                }
            };

            function init(collection) {
                $scope.listView.options.isSearchable = collection.isSearchable;
                $scope.listView.options.pageSize = collection.listView.pageSize;
                $scope.listView.options.defaultOrderBy = collection.listView.defaultOrderBy;
                $scope.listView.options.defaultOrderDirection = collection.listView.defaultOrderDirection;
                $scope.listView.options.bulkActions = collection.listView.bulkActions;
                $scope.listView.options.rowActions = collection.listView.rowActions;
                $scope.listView.options.filters = collection.listView.filters;
                $scope.listView.options.dataViews = collection.listView.dataViews;
                $scope.listView.options.layouts = collection.listView.layouts;
                $scope.listView.options.properties = collection.listView.properties;
            }
            
            // Get the collection data
            konstruktResource.getCollectionByAlias($scope.collectionAlias).then(function(collection) {
                $scope.collection = collection;
                init($scope.collection);
                if ($scope.onCollectionLoaded) {
                    $scope.onCollectionLoaded({ collection: $scope.collection });
                }
            });

            $scope.$watch("showCreateButton", function (newValue, oldValue, scope) {
                $scope.listView.options.showCreateButton = newValue;
            });
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Konstrukt/backoffice/directives/collectionlistview.html',
            scope: {
                parentEntityId: '<?',
                collectionAlias: '=',
                onCollectionLoaded: '&',
                openInInfiniteEditor: '=',
                showCreateButton: '<?'
            },
            link: link
        };

        return directive;

    }

    angular.module("umbraco.directives").directive("konstruktCollectionListView", konstruktCollectionListView);

})();