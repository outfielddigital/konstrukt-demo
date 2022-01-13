// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function collectionPickerController($scope, konstruktResource) {

        $scope.properties = [
            {
                alias: "section",
                label: "Section",
                description: "Select the section the collection is located in",
                value: ""
            },
            {
                alias: "collection",
                label: "Collection",
                description: "Select the collection to pick items from",
                value: ""
            },
            {
                alias: "dataView",
                label: "Data view",
                description: "Select an optional data view to filter the collection with",
                value: ""
            }
        ];

        $scope.clearCollection = function() {
            $scope.properties[1].value = $scope.properties[2].value = '';
        }

        $scope.clearDataView = function () {
            $scope.properties[2].value = '';
        }

        konstruktResource.getCollectionsLookup().then(function (data) {

            // Fix null data view groups
            data.forEach(function (itm) {
                itm.collections.forEach(function (col) {
                    if (col.dataViews) {
                        col.dataViews.forEach(function (dv) {
                            if (dv.group == null)
                                dv.group = undefined;
                        });
                    }
                });
            });

            $scope.data = data;

            if ($scope.model.value) {
                var aliases = $scope.model.value.split(',');

                if (aliases.length >= 1) {
                    var section = $scope.properties[0].value = _.find($scope.data, function(s) {
                        return s.alias == aliases[0];
                    });

                    if (aliases.length >= 2) {
                        var collection = $scope.properties[1].value = _.find(section.collections, function (c) {
                            return c.alias == aliases[1];
                        });

                        if (aliases.length >= 3) {
                            var dataView = $scope.properties[2].value = _.find(collection.dataViews, function (dv) {
                                return dv.alias == aliases[2];
                            });
                        }
                    }
                }
            }
        });

        var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {
            var aliases = [];
            if ($scope.properties[0].value) {
                aliases.push($scope.properties[0].value.alias);
                if ($scope.properties[1].value) {
                    aliases.push($scope.properties[1].value.alias);
                    if ($scope.properties[2].value) {
                        aliases.push($scope.properties[2].value.alias);
                    }
                }
            }
            $scope.model.value = aliases.join();
        });

        //when the scope is destroyed we need to unsubscribe
        $scope.$on('$destroy', function () {
            unsubscribe();
        });

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.CollectionPickerController", collectionPickerController);

})();