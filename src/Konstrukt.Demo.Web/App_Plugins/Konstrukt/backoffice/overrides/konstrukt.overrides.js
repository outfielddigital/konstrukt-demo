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
                if (args.scope.vm.redirectId) {
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
                'onItemClick': '&'
            });
            return $delegate;
        });

    }

    angular.module("umbraco.directives").config(['$provide', konstruktListViewLayoutDirectiveOverride]);

    // Call on list view item click function if defined on parent directive
    function konstruktListViewLayoutControllerOverrides($provide) {

        $provide.decorator('$controller', function ($delegate) {

            return function (expression, locals, later, indent) {

                if (locals.$attrs && locals.$attrs.ngController && locals.$attrs.ngController.startsWith("Umbraco.PropertyEditors.ListView.ListLayoutController"))
                {
                    var ctrl1 = $delegate(expression, locals, false, indent);

                    var oldClickItem = ctrl1.clickItem;
                    ctrl1.clickItem = function (item) {
                        if (!locals.$scope.onItemClick || !locals.$scope.onItemClick({ item: item})) {
                            oldClickItem.apply(ctrl1, arguments);
                        }
                    };

                    return () => ctrl1;
                }

                if (locals.$attrs && locals.$attrs.ngController && locals.$attrs.ngController.startsWith("Umbraco.PropertyEditors.ListView.GridLayoutController"))
                {
                    var ctrl2 = $delegate(expression, locals, false, indent);

                    var oldGoToItem = ctrl2.goToItem;
                    ctrl2.goToItem = function (item) {
                        if (!locals.$scope.onItemClick || !locals.$scope.onItemClick({ item: item})) {
                            oldGoToItem.apply(ctrl2, arguments);
                        }
                    };

                    return () => ctrl2;
                }

                return $delegate(expression, locals, later, indent);
            };

        });

    }

    angular.module("umbraco").config(['$provide', konstruktListViewLayoutControllerOverrides]);

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