// Required Notice:
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktRequestHelper(umbRequestHelper, konstruktUtils) {

        return {

            getApiUrl: function (apiName, actionName, queryStrings) {

                var konstruktUrls = konstruktUtils.getSettings("konstruktUrls");

                if (!konstruktUrls[apiName]) {
                    throw "No url found for api name " + apiName;
                }

                return konstruktUrls[apiName] + actionName +
                    (!queryStrings ? "" : "?" + (angular.isString(queryStrings) ? queryStrings : umbRequestHelper.dictionaryToQueryString(queryStrings)));

            }

        };

    };

    angular.module('umbraco.services').factory('konstruktRequestHelper', konstruktRequestHelper);

})();