// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktListView($routeParams, listViewHelper, editorService, localStorageService, konstruktActions, konstruktUtils) {

        function link($scope, el, attr, ctrl) {
            
            $scope.entityId = $routeParams.id;

            $scope.pagination = [];
            $scope.bulkActionInProgress = false;
            $scope.selection = [];
            $scope.listViewResultSet = {
                totalPages: 1,
                items: []
            };

            var filterCacheKey = "konstrukt_" + $scope.collection.alias +"_filters";

            $scope.options = angular.extend({}, {
                pageNumber: ($routeParams.page && !isNaN($routeParams.page) && Number($routeParams.page) > 0) ? $routeParams.page : 1,
                pageSize: $scope.opts.pageSize,
                orderBy: $scope.opts.defaultOrderBy || "name",
                orderDirection: $scope.opts.defaultOrderDirection || "desc",
                filter: '', // Variable has to be named "filter" to work with list view properly
                dataViewAlias: konstruktUtils.recallDataView($routeParams.id, $scope.opts.dataViews), // TODO: Remember the dataview like how the layout persists
                dataViews: $scope.opts.dataViews.map(function (itm) {
                    if (itm.group == null)
                        itm.group = undefined;
                    return itm;
                }),
                filters: $scope.opts.filters,
                filterValues: localStorageService.get(filterCacheKey) || {},
                bulkActions: $scope.opts.bulkActions,
                bulkActionsAllowed: $scope.opts.bulkActions && $scope.opts.bulkActions.length > 0,
                rowActions: $scope.opts.rowActions,
                isSearchable: $scope.opts.isSearchable,
                orderBySystemField: true,
                includeProperties: $scope.opts.properties,
                layout: {
                    layouts: $scope.opts.layouts,
                    activeLayout: listViewHelper.getLayout($routeParams.id, $scope.opts.layouts)
                },
                showCreateButton: $scope.opts.showCreateButton
            });

            var filterDialogOptions = {
                view: '/App_Plugins/Konstrukt/backoffice/dialogs/filter.html',
                size: 'small',
                config: {
                    name: "Filter Results",
                    filters: $scope.options.filters
                },
                submit: function (values) {
                    localStorageService.set(filterCacheKey, values);
                    $scope.options.filterValues = values;
                    $scope.options.pageNumber = 1;
                    $scope.reloadView($scope.entityId);
                    editorService.close();
                },
                close: function () {
                    editorService.close();
                }
            };

            Object.defineProperty(filterDialogOptions, "infiniteMode", {
                get: () => false,
                set: (value) => false
            });

            var searchListView = _.debounce(function () {
                $scope.$apply(function () {
                    makeSearch();
                });
            }, 500);

            function makeSearch() {
                if ($scope.options.filter !== null && $scope.options.filter !== undefined) {
                    $scope.options.pageNumber = 1;
                    $scope.reloadView($scope.entityId);
                }
            }

            $scope.hasFilterValues = function () {
                return Object.keys($scope.options.filterValues).length > 0;
            }

            $scope.appliedFilterCount = function () {
                return Object.keys($scope.options.filterValues).length;
            }

            $scope.forceSearch = function (ev) {
                //13: enter
                switch (ev.keyCode) {
                    case 13:
                        makeSearch();
                        break;
                }
            };

            $scope.enterSearch = function () {
                $scope.viewLoaded = false;
                searchListView();
            };


            $scope.changeDataView = function () {
                $scope.options.pageNumber = 1;
                konstruktUtils.rememberDataView($routeParams.id, $scope.options.dataViewAlias, $scope.options.dataViews);
                $scope.reloadView($scope.entityId);
            };

            $scope.isAnythingSelected = function () {
                return $scope.selection.length !== 0;
            };

            $scope.clearSelection = function () {
                $scope.bulkActionInProgress = false;
                listViewHelper.clearSelection($scope.listViewResultSet.items, false, $scope.selection);
            };

            $scope.performRowAction = function (action, id) {

                konstruktActions.performAction($scope.collection.alias,
                    action,
                    (settings) => $scope.onAction({ action, ids: [id], settings }),
                    null,
                    () => $scope.clearSelection());

            }

            $scope.performBulkAction = function (bulkAction) {

                var selected = $scope.selection;
                if (selected.length === 0)
                    return;

                var ids = selected.map(s => s.id);

                $scope.bulkActionInProgress = true;

                konstruktActions.performAction($scope.collection.alias,
                    bulkAction,
                    (settings) => $scope.onAction({ action: bulkAction, ids, settings }),
                    () => $scope.bulkActionInProgress = false,
                    () => $scope.clearSelection());
                
            };

            $scope.selectLayout = function (selectedLayout) {
                $scope.options.layout.activeLayout = listViewHelper.setLayout($routeParams.id, selectedLayout, $scope.options.layout.layouts);
            };

            $scope.openFilter = function () {
                filterDialogOptions.config.values = $scope.options.filterValues;
                editorService.open(filterDialogOptions);
            }

            $scope.nextPage = function (pageNumber) {
                $scope.options.pageNumber = pageNumber;
                $scope.reloadView($scope.entityId);
            };

            $scope.goToPage = function (pageNumber) {
                $scope.options.pageNumber = pageNumber;
                $scope.reloadView($scope.entityId);
            };

            $scope.prevPage = function (pageNumber) {
                $scope.options.pageNumber = pageNumber;
                $scope.reloadView($scope.entityId);
            };

            $scope.reloadView = function (id) {

                $scope.viewLoaded = false;

                if ($scope.onGetItems) {

                    listViewHelper.clearSelection($scope.listViewResultSet.items, $scope.folders, $scope.selection);

                    $scope.onGetItems({ id: id, options: $scope.options }).then(function (data) {

                        $scope.bulkActionInProgress = false;
                        $scope.listViewResultSet = data;

                        // Clear out items collection if there aren't any items
                        if ($scope.listViewResultSet.totalItems === 0) {
                            $scope.listViewResultSet.items = false;
                        }

                        // Create a property map by alias and copy all property values to be object level variables
                        if ($scope.listViewResultSet.items) {
                            _.each($scope.listViewResultSet.items, function (e, index) {

                                e.propertyMap = e.properties.reduce((acc, prop) => {
                                    return { ...acc, [prop.alias]: prop };
                                }, {});

                                _.each(e.properties, function (p, index) {
                                    e[p.alias] = p.value;
                                });

                            });
                        }

                        $scope.viewLoaded = true;

                        // NOTE: This might occur if we are requesting a higher page number than what is actually available, for example
                        // if you have more than one page and you delete all items on the last page. In this case, we need to reset to the last
                        // available page and then re-load again
                        if ($scope.listViewResultSet.totalPages > 0 && $scope.options.pageNumber > $scope.listViewResultSet.totalPages) {

                            // Reset pagnumber to max pages
                            $scope.options.pageNumber = $scope.listViewResultSet.totalPages;

                            // Reload!
                            $scope.reloadView(id);
                        }

                    });
                }
            };

            $scope.getContent = function (contentId) {
                $scope.reloadView($scope.entityId);
            };

            $scope.openItem = function (item) {
                if ($scope.onItemClick) {
                    $scope.onItemClick({ item: item});
                }
            };

            $scope.createItem = function () {
                if ($scope.onItemCreate) {
                    $scope.onItemCreate();
                }
            };

            $scope.getContent();

            $scope.$watch("opts.showCreateButton", function (newValue) {
                $scope.options.showCreateButton = newValue;
            });

            // Event listeners
            var evts = [];

            // load audit trail and redirects when on the info tab
            evts.push($scope.$on("konstrukt.reloadListView", function (event, args) {
                $scope.reloadView($scope.entityId);
            }));

            //ensure to unregister from all events!
            $scope.$on('$destroy', function () {
                for (var e in evts) {
                    evts[e]();
                }
            });
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Konstrukt/backoffice/directives/listview.html',
            scope: {
                collection: '=',
                opts: '=options',
                onGetItems: '&',
                onItemClick: '&',
                onAction: '&',
                onItemCreate: '&',
            },
            link: link
        };

        return directive;

    }

    angular.module("umbraco.directives").directive("konstruktListView", konstruktListView);

})();