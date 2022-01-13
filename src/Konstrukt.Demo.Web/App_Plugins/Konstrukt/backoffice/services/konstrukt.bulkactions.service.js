// Required Notice:
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktDeleteBulkAction(konstruktResource) {

        return {
            
            performAction: function(collection, id) {
                return konstruktResource.deleteEntity(collection, id);
            },

            getConfirmMessage: function (count) {
                return "Are you sure you want to delete " + count + " items?";
            },

            getProgressMessage: function(count, total) {
                return count + " of " + total + " items deleted";
            },

            getCompleteMessage: function(total) {
                return total + " items successfully deleted";
            }

        }

    }

    angular.module("umbraco.services").factory("konstruktDeleteBulkActionService", konstruktDeleteBulkAction);

})();