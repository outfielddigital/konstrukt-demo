// Required Notice:
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function ActionResultHandlersProvider() {

        var provider = this;

        provider.handlers = [
            ['konstruktUtils', function (konstruktUtils) {
                return {
                    resultType: 'KonstruktFileActionResult',
                    configureRequest: function (req) {
                        req.responseType = 'arraybuffer';
                    },
                    handleResult: function (result) {
                        var headers = result.headers();
                        var fileName = headers["content-disposition"].match(/filename=(.*?);/)[1];
                        var file = new Blob([result.data], { type: headers["content-type"] });
                        konstruktUtils.downloadFile(file, fileName);
                    }
                }
            }],
            ['$rootScope', function ($rootScope) {
                return {
                    resultType: 'KonstruktDeleteEntityActionResult',
                    handleResult: function (result) {
                        $rootScope.$broadcast("konstrukt.reloadListView");
                        if (result.data) {
                            $rootScope.$broadcast("konstrukt.entityDeleted", {
                                collectionAlias: result.data.collectionAlias,
                                entityIds: result.data.entityIds
                            });
                        }
                    }
                }
            }],
            ['$rootScope', function ($rootScope) {
                return {
                    resultType: 'KonstruktActionResult',
                    handleResult: function (result) {
                        $rootScope.$broadcast("konstrukt.reloadListView");
                    }
                }
            }]
        ];

        provider.$get = ['$injector', function ($injector) {
            var compiledHandlers = provider.handlers.map(itm => $injector.invoke(itm));
            return {
                getHandler: function (resultType) {
                    return compiledHandlers.find(h => h.resultType === resultType);
                }
            };
        }];
    };

    angular.module('umbraco').provider('konstruktActionResultHandlers', ActionResultHandlersProvider);

})();