// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function dashboardController($scope, appState, navigationService, konstruktResource) {

        var dashboardAlias = $scope.property.alias;

        $scope.dashboard = false;
        $scope.loading = true;

        konstruktResource.getDashboardByAlias(dashboardAlias).then(function(data) {
            $scope.dashboard = data;
            $scope.loading = false;
        });
    }

    angular.module("umbraco").controller("Konstrukt.Controllers.DashboardController", dashboardController);

})();