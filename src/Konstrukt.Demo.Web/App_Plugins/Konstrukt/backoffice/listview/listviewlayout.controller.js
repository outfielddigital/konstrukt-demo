// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function listViewLayoutController($scope, $timeout, listViewHelper, iconHelper, konstruktResource) {

        $scope.clickItem = function (item, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            if ($scope.onItemClick) {
                $scope.onItemClick({ item: item });
            }
        }

        $scope.selectItem = function(selectedItem, $index, $event) {
            listViewHelper.selectHandler(selectedItem, $index, $scope.items, $scope.selection, $event);
        }

        $scope.selectAll = function () {
            listViewHelper.selectAllItemsToggle($scope.items, $scope.selection);
        }

        $scope.isSelectedAll = function () {
            return listViewHelper.isSelectedAll($scope.items, $scope.selection);
        };

        $scope.isSortDirection = function (col, direction) {
            return listViewHelper.setSortingDirection(col, direction, $scope.options);
        };

        $scope.sort = function (field, allow, isSystem) {
            if (allow) {
                $scope.options.orderBySystemField = isSystem;
                listViewHelper.setSorting(field, allow, $scope.options);
                $scope.getContent($scope.contentId);
            }
        };

        $scope.getIcon = function (entry) {
            return iconHelper.convertFromLegacyIcon(entry.icon);
        };

        $scope.hasItemActions = function () {
            $scope.options.itemActions && $scope.options.itemActions.length > 0;
        }

        $scope.rowActions = {};
        $scope.rowActionsFactory = function (itm) {
            if (!$scope.rowActions[itm.key]) {
                $scope.rowActions[itm.key] = $scope.options.rowActions.map(ia => {
                    return {
                        labelKey: `actions_${ia.alias}`,
                        icon: ia.icon,
                        method: function () {
                            if ($scope.onItemActionClick) {
                                $scope.onItemActionClick({ action: ia, item: itm });
                            }
                        }
                    }
                });
            }
            return $scope.rowActions[itm.key];
        };

        function init() {
            
        }

        init();

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.ListViewLayoutController", listViewLayoutController);

})();