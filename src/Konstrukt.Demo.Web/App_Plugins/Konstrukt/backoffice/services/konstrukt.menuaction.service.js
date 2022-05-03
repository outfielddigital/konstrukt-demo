// Required Notice:
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktMenuActionService(konstruktActions, konstruktResource, navigationService) {

        return {

            executeMenuAction: function (model) {

                var metaData = model.action.metaData;

                var action = {
                    alias: metaData.actionAlias,
                    name: metaData.actionName,
                    type: metaData.actionType,
                    confirmAction: metaData.actionConfirmAction,
                    hasSettings: metaData.actionHasSettings,
                    resultType: metaData.actionResultType
                };

                navigationService.hideNavigation();

                konstruktActions.performAction(metaData.collectionAlias,
                    action,
                    (settings) => konstruktResource.performAction(metaData.collectionAlias,
                        metaData.actionType,
                        metaData.actionAlias,
                        metaData.entityId ? [metaData.entityId] : undefined,
                        settings,
                        metaData.resultType))
            }

        };

    };

    angular.module('umbraco.services').factory('konstruktMenuActionService', konstruktMenuActionService);

})();