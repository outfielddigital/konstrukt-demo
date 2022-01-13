// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function settingsDashboardController($scope, $timeout, navigationService, konstruktResource, konstruktUtils, konstruktRouteCache) {

        $scope.konstruktInfo = konstruktUtils.getSettings("konstruktInfo");

        function init() {

            konstruktRouteCache.getOrFetch("konstruktLicensingInfo",
                () => konstruktResource.getLicensingInfo()).then(function (data) {
                    $scope.licensingInfo = data;
                });

            $timeout(function () {
                navigationService.syncTree({
                    tree: "konstrukt-settings",
                    path: "-1"
                });
            });

        }

        init();

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.SettingsDashboardController", settingsDashboardController);

})();