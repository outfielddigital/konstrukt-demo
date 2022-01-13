// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function entityPickerController($scope, editorState, editorService, angularHelper, konstruktResource, $location) {

        var aliases = $scope.model.config.collection.split(',');
        var sectionAlias = aliases.length >= 1 ? aliases[0] : "";
        var collectionAlias = aliases.length >= 2 ? aliases[1] : "";
        var dataViewAlias = aliases.length >= 3 ? aliases[2] : "";

        $scope.renderModel = [];

        $scope.dialogEditor = editorState && editorState.current && editorState.current.isDialogEditor === true;
        
        // Config options
        $scope.configOptions = {
            showOpen: $scope.model.config.showOpen === "1"
        };

        // Sortable options
        $scope.sortableOptions = {
            axis: "y",
            containment: "parent",
            opacity: 0.7,
            tolerance: "pointer",
            scroll: true,
            zIndex: 6000,
            update: function (e, ui) {
                angularHelper.getCurrentForm($scope).$setDirty();
            }
        };

        // Dialog options
        var dialogOptions = {
            view: '/App_Plugins/Konstrukt/backoffice/dialogs/entitypicker.html',
            size: 'small',
            config: {
                collectionAlias: collectionAlias,
                dataViewAlias: dataViewAlias,
                multiPicker: $scope.model.config.maxItems > 1,
            },
            submit: function (model) {
                if (angular.isArray(model.selection)) {
                    _.each(model.selection, function (item, i) {
                        $scope.addItem(item);
                    });
                }
                editorService.close();
            },
            close: function () {
                editorService.close();
            }
        };

        $scope.addItem = function (item) {
            var currIds = _.map($scope.renderModel, function (i) {
                return i.id;
            });

            var itemId = item.id;

            if (currIds.indexOf(itemId) < 0) {
                $scope.renderModel.push({
                    "name": item.name,
                    "id": item.id,
                    "collectionSourceAlias" : item.collectionSourceAlias,
                    "collectionAlias": item.collectionAlias,
                    "icon": item.icon,
                    "path": item.path,
                    "url": "",
                    "published": true
                    // only content supports published/unpublished content so we set everything else to published so the UI looks correct 
                });
            }
        };

        $scope.openPicker = function () {
            editorService.open(dialogOptions);
        };

        $scope.removeItem = function (index) {
            $scope.renderModel.splice(index, 1);
            angularHelper.getCurrentForm($scope).$setDirty();
        };

        $scope.openItem = function (node) {
            $location.path("/" + node.collectionSourceAlias + "/konstrukt/edit/" + node.collectionAlias + "!" + node.id);
        };

        $scope.clearAll = function () {
            $scope.renderModel = [];
        };

        function trim(str, chr) {
            var rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^' + chr + '+|' + chr + '+$', 'g');
            return str.replace(rgxtrim, '');
        }

        function startWatch() {

            // We need to watch our renderModel so that we can update the underlying $scope.model.value properly, this is required
            // because the ui-sortable doesn't dispatch an event after the digest of the sort operation. Any of the events for UI sortable
            // occur after the DOM has updated but BEFORE the digest has occured so the model has NOT changed yet - it even states so in the docs.
            // In their source code there is no event so we need to just subscribe to our model changes here.
            // This also makes it easier to manage models, we update one and the rest will just work.
            $scope.$watch(function () {
                //return the joined Ids as a string to watch
                return _.map($scope.renderModel, function (i) {
                    return i.id;
                }).join();
            }, function (newVal) {

                $scope.model.value = trim(newVal, ",");

                //Validate!
                if ($scope.model.config && $scope.model.config.minItems && parseInt($scope.model.config.minItems) > $scope.renderModel.length) {
                    $scope.entityPickerForm.minCount.$setValidity("minCount", false);
                }
                else {
                    $scope.entityPickerForm.minCount.$setValidity("minCount", true);
                }

                if ($scope.model.config && $scope.model.config.maxItems && parseInt($scope.model.config.maxItems) < $scope.renderModel.length) {
                    $scope.entityPickerForm.maxCount.$setValidity("maxCount", false);
                }
                else {
                    $scope.entityPickerForm.maxCount.$setValidity("maxCount", true);
                }

                setSortingState($scope.renderModel);

                angularHelper.getCurrentForm($scope).$setDirty();

            });
        }

        function setSortingState(items) {
            // disable sorting if the list only consist of one item
            if (items.length > 1) {
                $scope.sortableOptions.disabled = false;
            } else {
                $scope.sortableOptions.disabled = true;
            }
        }

        // Update model on submit
        var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {
            var currIds = _.map($scope.renderModel, function (i) {
                return i.id;
            });
            $scope.model.value = trim(currIds.join(), ",");
        });

        // When the scope is destroyed we need to unsubscribe
        $scope.$on('$destroy', function () {
            unsubscribe();
        });

        // Initialize
        var modelIds = $scope.model.value ? $scope.model.value.split(',') : [];

        // Load current data if anything selected
        if (modelIds.length > 0) {
            konstruktResource.getEntitiesByIds(collectionAlias, modelIds).then(function (data) {

                // Add the entites to the renderModel making sure
                // they maintain their stored order
                _.each(modelIds, function (id, i) {
                    var itm = _.find(data, function(o) {
                        return o.id == id;
                    });
                    if (itm) {
                        $scope.addItem(itm);
                    }
                });

                // Everything is loaded, start the watch on the model
                startWatch();

            });
        }
        else
        {
            // Everything is loaded, start the watch on the model
            startWatch();
        }

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.EntityPickerController", entityPickerController);

})();
