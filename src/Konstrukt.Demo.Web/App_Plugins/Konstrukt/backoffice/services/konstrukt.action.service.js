// Required Notice:
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktActions(editorService, overlayService, notificationsService, konstruktActionResultHandlers) {

        var settingsEditorDialogOptions = {
            view: '/App_Plugins/Konstrukt/backoffice/dialogs/settings.html',
            size: 'small',
            config: {
                name: "Action Settings"
            },
            submit: function (settings) {
                editorService.closeAll();
                if (this.config.continueCallback)
                    this.config.continueCallback(settings);
            },
            close: function () {
                editorService.close();
                if (this.config.cancelCallback)
                    this.config.cancelCallback();
            }
        };

        // We define a expliciti property on the config and ALWAYS return false
        // not matter what value this property is set to as the Umbraco editor
        // api will attempt to set this to `true` but this causes a weird
        // animation glitch where the dialog appears to slide into the right
        // hand side of the screen, rather than just appearing nicely.
        Object.defineProperty(settingsEditorDialogOptions, "infiniteMode", {
            get: () => false,
            set: (value) => false
        });

        var service = {

            performAction: function (collectionAlias, action, performAction, onSuccess, onCancel) {

                var doAction = function (settings) {
                    performAction(settings).then(function (result) {

                        var handler = konstruktActionResultHandlers.getHandler(action.resultType);
                        if (handler && handler.handleResult) {
                            handler.handleResult(result);
                        }

                        if (onSuccess)
                            onSuccess();

                        notificationsService.success("Action Successful", action.name + " action successfully performed.");

                    });
                }

                var doConfigureAction = function () {
                    if (action.hasSettings) {
                        settingsEditorDialogOptions.config.collectionAlias = collectionAlias;
                        settingsEditorDialogOptions.config.settingsSourceType = action.type;
                        settingsEditorDialogOptions.config.settingsSourceAlias = action.alias;
                        settingsEditorDialogOptions.config.continueCallback = doAction;
                        settingsEditorDialogOptions.config.cancelCallback = onCancel;
                        editorService.open(settingsEditorDialogOptions);
                    } else {
                        doAction();
                    }
                }

                if (action.confirmAction) {
                    overlayService.confirm({
                        title: "Confirm Action",
                        content: "Are you sure you want to perform the '" + action.name + "' action on this item?",
                        submitButtonLabelKey: "general_yes",
                        submitButtonStyle: "warning",
                        close: function () {
                            overlayService.close();
                        },
                        submit: function () {
                            overlayService.close();
                            doConfigureAction();
                        }
                    });
                } else {
                    doConfigureAction();
                }

            }
        };

        return service;
    }

    angular.module('umbraco.services').factory('konstruktActions', konstruktActions);

})();