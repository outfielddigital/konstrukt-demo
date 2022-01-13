// Required Notice:
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktResource($http, umbRequestHelper, konstruktRequestHelper) {

        var api = {

            getSectionByAlias: function (sectionAlias) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetSectionByAlias"),
                        method: "GET",
                        params: {
                            sectionAlias: sectionAlias
                        }
                    }),
                    'Failed to get section by alias'
                );
            },

            getDashboardByAlias: function (dashboardAlias) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetDashboardByAlias"),
                        method: "GET",
                        params: {
                            dashboardAlias: dashboardAlias
                        }
                    }),
                    'Failed to get dashboard by alias'
                );
            },

            getCollectionsLookup: function () {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetCollectionsLookup"),
                        method: "GET"
                    }),
                    'Failed to get collections lookup'
                );
            },

            getSectionDashboardCollections: function (sectionAlias) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetSectionDashboardCollections"),
                        method: "GET",
                        params: {
                            sectionAlias: sectionAlias
                        }
                    }),
                    'Failed to get dashboard collections'
                );
            },

            getContextAppCollections: function (contextAppAlias) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetContextAppCollections"),
                        method: "GET",
                        params: {
                            contextAppAlias: contextAppAlias
                        }
                    }),
                    'Failed to get context app collections'
                );
            },

            getCollectionByAlias: function (collectionAlias) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetCollectionByAlias"),
                        method: "GET",
                        params: {
                            collectionAlias: collectionAlias
                        }
                    }),
                    'Failed to get section collection by alias'
                );
            },

            getEntitiesByIds: function (collectionAlias, ids) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetEntitiesByIds"),
                        method: "GET",
                        params: {
                            collectionAlias: collectionAlias,
                            ids: ids.join(',')
                        }
                    }),
                    'Failed to get entities'
                );
            },

            getEntities: function (collectionAlias, options) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetEntities"),
                        method: "GET",
                        params: {
                            collectionAlias: collectionAlias,
                            pageNumber: options.pageNumber,
                            pageSize: options.pageSize,
                            orderBy: options.orderBy,
                            orderDirection: options.orderDirection,
                            query: options.filter,
                            dataViewAlias: options.dataViewAlias
                        }
                    }),
                    'Failed to get entities'
                );
            },

            getChildEntities: function (collectionAlias, parentId, options) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetEntities"),
                        method: "GET",
                        params: {
                            collectionAlias: collectionAlias,
                            parentId: parentId,
                            pageNumber: options.pageNumber,
                            pageSize: options.pageSize,
                            orderBy: options.orderBy,
                            orderDirection: options.orderDirection,
                            query: options.filter,
                            dataViewAlias: options.dataViewAlias
                        }
                    }),
                    'Failed to get entities'
                );
            },

            saveEntity: function (entity, isNew, files) {
                return umbRequestHelper.postSaveContent({
                    restApiUrl: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "SaveEntity"),
                    content: entity,
                    action: "save",
                    files: files,
                    dataFormatter: function (c, a) {
                        return c;
                    }
                });
            },

            getEntityScaffold: function (collectionAlias) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetEntityScaffold"),
                        method: "GET",
                        params: {
                            collectionAlias: collectionAlias
                        }
                    }),
                    'Failed to get entity scaffold'
                );
            },

            getEntityById: function (collectionAlias, id) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetEntityById"),
                        method: "GET",
                        params: {
                            collectionAlias: collectionAlias,
                            id: id
                        }
                    }),
                    'Failed to get entity by id'
                );
            },

            deleteEntity: function (collectionAlias, id) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "DeleteEntity"),
                        method: "DELETE",
                        params: {
                            collectionAlias: collectionAlias,
                            id: id
                        }
                    }),
                    'Failed to delete entity'
                );
            },

            getEntityCount: function (collectionAlias) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetEntityCount"),
                        method: "GET",
                        params: {
                            collectionAlias: collectionAlias
                        }
                    }),
                    'Failed to get entity total record count'
                );
            },

            getLicensingInfo: function () {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: konstruktRequestHelper.getApiUrl("konstruktApiBaseUrl", "GetLicensingInfo"),
                        method: "GET"
                    }),
                    'Failed to get licensing info'
                );
            },

        };

        return api;

    }

    angular.module("umbraco.resources").factory("konstruktResource", konstruktResource);

})();