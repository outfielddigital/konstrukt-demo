// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function filterDialogController($scope, formHelper, konstruktResource) {

        var cfg = $scope.model.config;

        $scope.loading = true;

        $scope.page = {};
        $scope.page.name = cfg.name;

        $scope.filters = cfg.filters.map(f => {
            var nf = angular.extend({}, f);
            nf.model = {
                alias: nf.alias,
                value: cfg.values[nf.alias],
                config: {
                    options: f.options
                }
            }
            return nf;
        });

        $scope.init = function () {
            $scope.loading = false;
        };

        $scope.save = function () {

            var model = {};

            $scope.filters.forEach(f => {
                if (f.model.value && f.model.value.some(x => !!x)) {
                    model[f.model.alias] = f.model.value;
                }
            })

            $scope.model.submit(model);
        };

        $scope.reset = function () {
            $scope.filters.forEach(f => f.model.value = '');
        };

        $scope.close = function () {
            $scope.model.close();
        };

        $scope.init();

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.FilterDialogController", filterDialogController);

})();