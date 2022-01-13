// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktMessage() {

        function link(scope, el, attr, ctrl) { }

        var directive = {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: '/App_Plugins/Konstrukt/backoffice/directives/message.html',
            scope: {
                heading: '<',
                type: '<',
                icon: '<'
            },
            link: link
        };

        return directive;
    };

    angular.module('umbraco.directives').directive('konstruktMessage', konstruktMessage);

})();