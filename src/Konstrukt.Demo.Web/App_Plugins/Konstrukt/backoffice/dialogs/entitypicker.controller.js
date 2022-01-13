// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function entityPickerDialogController($scope, editorState, angularHelper, konstruktResource) {

        $scope.dialogOptions = $scope.model.config;

        $scope.loading = true;
        $scope.model.selection = [];

        $scope.listView = {
            options: {
                dataViewAlias: $scope.dialogOptions.dataViewAlias,
                isSearchable: false,
                defaultOrderBy: "Name",
                defaultOrderDirection: "desc"
            },
            getItems: function (id, options) {
                return konstruktResource.getEntities($scope.dialogOptions.collectionAlias, options).then(function (data) {

                    // Repopulate selection
                    _.each(data.items, function (itm) {
                        var selectedItem = _.find($scope.model.selection, function (o) {
                            return o.id === itm.id;
                        });
                        if (selectedItem) {
                            itm.selected = true;
                        }
                    });

                    return data;
                });
            },
            selectItem: function (itm) {
                itm.selected = itm.selected === true ? false : true;
                if (itm.selected) {
                    $scope.model.selection.push(itm);
                    if (!$scope.dialogOptions.multiPicker) {
                        $scope.model.submit($scope.model);
                    }
                } else {
                    $scope.model.selection = _.reject($scope.model.selection, function (o) {
                        return o.id === itm.id;
                    });
                }
            }
        };

        function init(collection) {
			$scope.listView.options.isSearchable = collection.isSearchable;
			$scope.listView.options.defaultOrderBy = collection.listView.defaultOrderBy;
			$scope.listView.options.defaultOrderDirection = collection.listView.defaultOrderDirection;
            $scope.collection = collection;
            $scope.loading = false;
        }

        // Get the collection data
        konstruktResource.getCollectionByAlias($scope.dialogOptions.collectionAlias).then(function (data) {
            init(data);
        });

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.EntityPickerDialogController", entityPickerDialogController);

})();