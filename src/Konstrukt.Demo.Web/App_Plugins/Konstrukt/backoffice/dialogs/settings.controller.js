// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function settingsDialogController($scope, formHelper, konstruktResource) {

        var cfg = $scope.model.config;

        $scope.loading = true;

        $scope.page = {};
        $scope.page.name = cfg.name;
        $scope.page.saveButtonState = 'init';

        $scope.settingsModel = angular.copy($scope.model.value);
        $scope.options = {
            settingDefinitions: []
        };

        $scope.init = function () {
            konstruktResource.getSettingsScaffold(cfg.collectionAlias, cfg.settingsSourceType, cfg.settingsSourceAlias).then(function (settingsScaffold) {
                $scope.settingsModel = settingsScaffold;
                $scope.loading = false;
            });
        };

        $scope.save = function () {
            if (formHelper.submitForm({ scope: $scope })) {

                var postModel = { properties: [] };

                $scope.settingsModel.fieldsets.forEach(fset => {
                    fset.properties.forEach(prop => {
                        postModel.properties.push({ id: prop.id, alias: prop.alias, value: prop.value });
                    });
                });

                $scope.model.submit(postModel);

            }
        };

        $scope.close = function () {
            $scope.model.close();
        };

        $scope.init();

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.SettingsDialogController", settingsDialogController);

})();