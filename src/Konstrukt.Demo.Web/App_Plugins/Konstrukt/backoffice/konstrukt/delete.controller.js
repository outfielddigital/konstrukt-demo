// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function deleteController($scope, $rootScope, konstruktResource, treeService, navigationService, editorState, $location, notificationsService) {

        var currentNode = $scope.currentNode;
        var collectionAlias = currentNode.metaData['collectionAlias'];
        var type = currentNode.metaData['entityType'];
        var id = currentNode.metaData['entityId'];

        var vm = this;

        vm.saveButtonState = 'init';
        vm.currentNode = currentNode;

        vm.performDelete = function() {

            // Prevent double clicking casuing additional delete requests
            vm.saveButtonState = 'busy';

            // Show the loading animation
            vm.currentNode.loading = true;

            // Reset the error message
            vm.error = null;

            // Perform the delete
            konstruktResource.deleteEntity(vm.currentNode.metaData.collectionAlias,
                vm.currentNode.metaData.entityId).then(function () {

                // Hide the loading animation
                vm.currentNode.loading = false;

                // Remove the node from the tree
                try {
                    treeService.removeNode(vm.currentNode);
                } catch (err) {
                    // If there is an error, the tree probably doesn't show children
                }

                // Close the menu
                navigationService.hideMenu();

                // Show notification
                notificationsService.success("Entity deleted", "Entity '" + currentNode.name + "' successfully deleted");

                // Notify views
                $rootScope.$broadcast("konstruktEntityDeleted", {
                    collectionAlias: collectionAlias,
                    entityType: type,
                    entityId: id
                });

                // If the current edited item is the same one as we're deleting, we need to navigate elsewhere
                if (editorState.current && editorState.current.path == vm.currentNode.path) {

                    // Just navigate to the section dashboard
                    $location.path("/" + vm.currentNode.metaData.dashboardRoute);

                }

            }, function (err) {

                // Stop tree node animation
                vm.currentNode.loading = false;

                // Set the error object
                vm.error = err;

                // Set not busy
                vm.saveButtonState = 'error';

            });

        };

        vm.cancel = function() {
            navigationService.hideDialog();
        };
    }

    angular.module("umbraco").controller("Konstrukt.Controllers.DeleteController", deleteController);

})();