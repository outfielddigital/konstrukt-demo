// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    // Umbraco services overrides
    function konstruktUmbracoServicesOverrides($provide) {

        $provide.decorator('contentEditingHelper', function ($delegate) {

            // Override handleSuccessfulSave and look for redirectId in scope
            // instead of just args as args is not modifiable like scope is.
            // We need this as we use a non standard ID structure in urls so
            // need to provide an explicit redirect ID
            var oldHandleSuccessfulSave = $delegate.handleSuccessfulSave;
            $delegate.handleSuccessfulSave = function (args) {
                if (args.scope && args.scope.vm && args.scope.vm.redirectId) {
                    args.redirectId = args.scope.vm.redirectId;
                }
                oldHandleSuccessfulSave.apply($delegate, arguments);
            };

            return $delegate;

        });

    }

    angular.module("umbraco.services").config(['$provide', konstruktUmbracoServicesOverrides]);

    // Add on item click binding to list view layout directive
    function konstruktListViewLayoutDirectiveOverride($provide) {

        $provide.decorator('umbListViewLayoutDirective', function ($delegate) {
            var directive = $delegate[0];
            angular.extend(directive.scope, {
                'onItemClick': '&',
                'onItemActionClick': '&'
            });
            return $delegate;
        });

    }

    angular.module("umbraco.directives").config(['$provide', konstruktListViewLayoutDirectiveOverride]);

    // Umbraco resource overrides
    function konstruktUmbracoResourceOverrides($provide) {

       $provide.decorator('entityResource', function ($delegate) {

           // When using MNTP with an xpath filter with Konstrukt
           // a call to getByQuery is made using the $routeParams.id
           // as context. Unfortunately it expects that variable to
           // be an int, which in Konstrukt's case is not, so we 
           // intercept the call and just set it to the root id.
           var oldGetByQuery = $delegate.getByQuery;
           $delegate.getByQuery = function () {
               if (arguments.length >= 2 && arguments[1].toString().indexOf('!') >= 0) { // '!' signifies a Konstrukt composite id
                   arguments[1] = -1;
               }
               return oldGetByQuery.apply($delegate, arguments);
           };

           return $delegate;

       });

    }

    angular.module("umbraco.resources").config(['$provide', konstruktUmbracoResourceOverrides]);

})();