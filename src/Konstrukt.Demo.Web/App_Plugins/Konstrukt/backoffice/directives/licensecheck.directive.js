// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktLicenseCheck($location, konstruktResource, konstruktRouteCache) {

        function link(scope, el, attr, ctrl) {
            konstruktRouteCache.getOrFetch("konstruktLicensingInfo",
                () => konstruktResource.getLicensingInfo()).then(function (data) {
                    scope.licensingInfo = data;
                });
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Konstrukt/backoffice/directives/licensecheck.html',
            scope: {
                parentEntityId: '<?',
                sectionAlias: '=',
                collectionAlias: '=',
                onCollectionLoaded: '&',
                openInInfiniteEditor: '=',
                showCreateButton: '<?'
            },
            link: link
        };

        return directive;

    }

    angular.module("umbraco.directives").directive("konstruktLicenseCheck", konstruktLicenseCheck);

})();