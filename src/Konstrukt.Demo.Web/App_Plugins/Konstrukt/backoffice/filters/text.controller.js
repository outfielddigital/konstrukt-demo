// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function textFilterController($scope) {

        function init() {
            if (!$scope.model.value)
                $scope.model.value = [""];
        }

        init();

        $scope.$watch("model.value", function () {
            init();
        });

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.TextFilterController", textFilterController);

})();