// Required Notice:
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktUtils(localStorageService) {

        var dataViewLocalStorageKey = "konstruktDataViewes";

        function saveDataViewInLocalStorage(nodeId, selectedDataViewAlias) {
            var dataViewFound = false;
            var storedDataViews = [];

            if (localStorageService.get(dataViewLocalStorageKey)) {
                storedDataViews = localStorageService.get(dataViewLocalStorageKey);
            }

            if (storedDataViews.length > 0) {
                for (var i = 0; storedDataViews.length > i; i++) {
                    var entry = storedDataViews[i];
                    if (entry.nodeId === nodeId) {
                        entry.alias = selectedDataViewAlias;
                        dataViewFound = true;
                    }
                }
            }

            if (!dataViewFound) {
                var storageObject = {
                    "nodeId": nodeId,
                    "alias": selectedDataViewAlias
                };
                storedDataViews.push(storageObject);
            }

            localStorageService.set(dataViewLocalStorageKey, storedDataViews);

        }

        var service = {

            getSettings: function (key) {
                if (!Umbraco || !Umbraco.Sys || !Umbraco.Sys.ServerVariables || !Umbraco.Sys.ServerVariables["konstrukt"] || !Umbraco.Sys.ServerVariables["konstrukt"][key]) {
                    throw "No Konstrukt setting found with key " + key;
                }
                return Umbraco.Sys.ServerVariables["konstrukt"][key];
            },

            rememberDataView: function (nodeId, selectedDataViewAlias, availableDataViews) {
                
                var activeDataView = {};
                var dataViewFound = false;

                for (var i = 0; availableDataViews.length > i; i++) {
                    var dataView = availableDataViews[i];
                    if (dataView.alias === selectedDataViewAlias) {
                        activeDataView = dataView;
                        dataViewFound = true;
                    }
                }

                if (!dataViewFound && availableDataViews.length > 0) {
                    activeDataView = availableDataViews[0];
                }

                saveDataViewInLocalStorage(nodeId, activeDataView.alias);

                return activeDataView.alias;

            },

            recallDataView: function (nodeId, availableDataViews) {

                if (availableDataViews.length == 0)
                    return undefined;

                var storedDataViews = [];

                if (localStorageService.get(dataViewLocalStorageKey)) {
                    storedDataViews = localStorageService.get(dataViewLocalStorageKey);
                }

                if (storedDataViews && storedDataViews.length > 0) {
                    for (var i = 0; storedDataViews.length > i; i++) {
                        var entry = storedDataViews[i];
                        if (entry.nodeId === nodeId) {
                            return service.rememberDataView(nodeId, entry.alias, availableDataViews);
                        }
                    }

                }

                return availableDataViews[0].alias;

            },

            compareCurrentUmbracoVersion: function compareCurrentUmbracoVersion(v, options) {
                return this.compareVersions(Umbraco.Sys.ServerVariables.application.version, v, options);
            },

            compareVersions: function compareVersions(v1, v2, options) {

                var lexicographical = options && options.lexicographical,
                    zeroExtend = options && options.zeroExtend,
                    v1parts = v1.split('.'),
                    v2parts = v2.split('.');

                function isValidPart(x) {
                    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
                }

                if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
                    return NaN;
                }

                if (zeroExtend) {
                    while (v1parts.length < v2parts.length) {
                        v1parts.push("0");
                    }
                    while (v2parts.length < v1parts.length) {
                        v2parts.push("0");
                    }
                }

                if (!lexicographical) {
                    v1parts = v1parts.map(Number);
                    v2parts = v2parts.map(Number);
                }

                for (var i = 0; i < v1parts.length; ++i) {
                    if (v2parts.length === i) {
                        return 1;
                    }

                    if (v1parts[i] === v2parts[i]) {
                        continue;
                    } else if (v1parts[i] > v2parts[i]) {
                        return 1;
                    } else {
                        return -1;
                    }
                }

                if (v1parts.length !== v2parts.length) {
                    return -1;
                }

                return 0;
            },

            createBreadcrumbFromTreeNode: function (treeNode) {
                var breadcrumb = [];

                var currentNode = treeNode;
                while (currentNode.path !== "-1") {
                    breadcrumb.splice(0, 0, {
                        name: currentNode.name,
                        routePath: currentNode.routePath
                    });
                    currentNode = currentNode.parent();
                }

                return breadcrumb;
            },
        };

        return service;
    }

    angular.module('umbraco.services').factory('konstruktUtils', konstruktUtils);

})();