// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function selectFilterController($scope) {

        $scope.options = [{ key: '', label: '-- Select an Option --' }, ...$scope.model.config.options];

        function init() {
            if (!$scope.model.value)
                $scope.model.value = [$scope.options[0].key];
        }

        init();

        $scope.$watch("model.value", function () {
            init();
        });

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.SelectFilterController", selectFilterController);

})();