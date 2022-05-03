// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function checkboxFilterController($scope) {

        $scope.options = $scope.model.config.options;

        $scope.toggleOption = function (val) {
            if ($scope.model.value.includes(val)) {
                $scope.model.value = $scope.model.value.filter(v => v != val);
            } else {
                $scope.model.value.push(val);
            }
        }

        function init() {
            if (!$scope.model.value)
                $scope.model.value = [];
        }

        init();

        $scope.$watch("model.value", function () {
            init();
        });
    }

    angular.module("umbraco").controller("Konstrukt.Controllers.CheckboxFilterController", checkboxFilterController);

})();