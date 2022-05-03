// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function editController($scope, $routeParams, $http, $location, $timeout, appState, notificationsService, editorState, eventsService, navigationService, umbRequestHelper, contentEditingHelper, localizationService, konstruktResource, konstruktUtils) {

        var idParts = $routeParams.id ? $routeParams.id.split("!") : [];
        var infiniteMode = $scope.model && $scope.model.infiniteMode;

        var sectionAlias = appState.getSectionState("currentSection");
        var collectionAlias = infiniteMode ? $scope.model.collectionAlias : idParts[0];
        var id = infiniteMode ? $scope.model.id || "0" : idParts.length > 1 ? idParts[1] : "0";

        var isNew = id == "0";
        var evts = [];

        // Fake the create route param as some of the umbraco
        // helpers expect it to be there
        $routeParams.create = isNew;

        //TODO: Handle returning the an entity with a sub list view on it
        //TODO: Handle entity menu items

        var localizeSaving = localizationService.localize("general_saving");

        var vm = this;

        vm.infiniteMode = infiniteMode;
        vm.entityId = !isNew ? id : undefined;
        vm.currentApp = undefined;

        // Setup the page (mimicing how the content editor works)
        vm.page = {};
        vm.page.loading = false;

        vm.page.menu = {}; 
        vm.page.menu.currentNode = null;
        vm.page.menu.currentSection = sectionAlias;

        vm.page.navigation = [
            {
                'name': 'Content',
                'alias': 'content',
                'icon': 'icon-document',
                'view': '/App_Plugins/Konstrukt/backoffice/konstrukt/edit.content.html',
                'active': true
            }
        ];

        vm.page.breadcrumb = {};
        vm.page.breadcrumb.items = [];
        vm.page.breadcrumb.itemClick = function (ancestor) {
            $location.path(ancestor.routePath);
        };

        vm.page.listViewPath = null;
        vm.page.isNew = isNew;
        vm.page.saveButtonState = "init";

        vm.close = function () {
            if (infiniteMode) {
                $scope.model.close();
            }
        };

        vm.changeTab = function (tabs, selectedTab) {
            tabs.forEach(function (tab) {
                tab.active = false;
            });
            selectedTab.active = true;
        };

        vm.back = function () {
            $location.path(vm.page.listViewPath);
        };

        vm.save = function () {

            vm.page.saveButtonState = "busy";

            contentEditingHelper.contentEditorPerformSave({
                statusMessage: localizeSaving,
                saveMethod: function (entity, isNew, files) {

                    var postModel = {
                        collectionSourceAlias: entity.collectionSourceAlias,
                        collectionAlias: entity.collectionAlias,
                        id: entity.id,
                        parentId: infiniteMode ? $scope.model.parentId : undefined,
                        name: entity.name,
                        properties: []
                    };

                    getAllProperties(entity).forEach(prop => {
                        postModel.properties.push({
                            id: prop.id,
                            alias: prop.alias,
                            value: prop.value
                        });
                    });

                    return konstruktResource.saveEntity(postModel, isNew, files).then(function (savedEntity) {

                        // Stash a composite in scope as the contentEditorPerformSave will
                        // perform a redirect to the edit screen if an entity is new but 
                        // Konstrukt uses a componsite ID and not just the entity id
                        vm.redirectId = savedEntity.collectionAlias + "!" + savedEntity.id;

                        return savedEntity;

                    });

                },
                rebindCallback: function () { }, // Don't use Umbraco rebind function, we'll do it ourselves next
                scope: $scope,
                content: vm.content,
                infiniteMode: infiniteMode,
                // We do not redirect on failure for entities - this is because it is not possible to actually save the entity
                // when server side validation fails - as opposed to umbraco content where we are capable of saving the content
                // item if server side validation fails
                redirectOnFailure: false
            }).then(function (data) {

                vm.entityId = data.id;
                vm.page.isNew = isNew = $routeParams.create = false;

                // Map root properties
                vm.content.id = data.id;
                vm.content.key = data.key;
                vm.content.name = data.name;
                vm.content.createDate = data.createDate;
                vm.content.updateDate = data.updateDate;
                vm.content.treeNodeUrl = data.treeNodeUrl;
                vm.content.path = data.path;

                // Map editor properties
                var origProps = getAllProperties(vm.content);
                var newProps = getAllProperties(data);

                for (var p = 0; p < origProps.length; p++) {
                    var origProp = origProps[p];
                    var newProp = _.find(newProps, { 'alias': origProp.alias });
                    if (newProp && !_.isEqual(origProp.value, newProp.value)) {

                        var origValue = origProp.value;
                        origProp.value = newProp.value;

                        //instead of having a property editor $watch their expression to check if it has
                        // been updated, instead we'll check for the existence of a special method on their model
                        // and just call it.
                        if (angular.isFunction(origProp.onValueChanged)) {
                            origProp.onValueChanged(origProp.value, origValue);
                        }

                    }
                }

                editorState.set(vm.content);

                if (!infiniteMode) {
                    syncTree(vm.content, data.path);
                } else {
                    $scope.model.submit(data);
                }

                vm.page.saveButtonState = "success";

                return data;

            }, function (err) {
                if (err) {
                    notificationsService.error("Failed to save " + vm.content.name, err.data ? err.data.message || err.data.Message : err.errorMsg);
                }
                vm.page.saveButtonState = "error";
            });
        };

        function getAllProperties(entity) {
            var props = [];
            entity.tabs.forEach(tab => {
                tab.fieldsets.forEach(fs => {
                    fs.properties.forEach(prop => {
                        props.push(prop);
                    });
                });
            });
            return props;
        }

        function syncTree(entity, path, initialLoad)
        {
            var pathParts = path.split(",");

            if (!isNew)
                pathParts.pop();
            
            navigationService.syncTree({ tree: entity.collectionSourceAlias, path: pathParts, forceReload: initialLoad !== true }).then(function (syncArgs) {
                if (!isNew) {
                    $http.get(entity.treeNodeUrl).then(function (result) {
                        var node = result.data;
                        node.parent = () => syncArgs.node;
                        vm.page.menu.currentNode = node;
                        vm.page.breadcrumb.items = konstruktUtils.createBreadcrumbFromTreeNode(node);
                    });
                } else {
                    vm.page.breadcrumb.items = konstruktUtils.createBreadcrumbFromTreeNode(syncArgs.node);
                    vm.page.breadcrumb.items.push({ name: 'Untitled' });
                }
            });
        }

        function postLoadContent(data) {

            vm.content = data;

            editorState.set(vm.content);

            vm.page.navigation[0].name = vm.content.collectionNameSingular;
            vm.page.navigation[0].icon = vm.content.collectionIconSingular;

            if (vm.content.apps && vm.content.apps.length > 0) {

                vm.content.apps.forEach((itm) => {
                    vm.page.navigation.push({
                        'name': itm.name,
                        'alias': itm.alias,
                        'icon': itm.icon,
                        'view': '/App_Plugins/Konstrukt/backoffice/konstrukt/edit.childitems.html',
                        'isCollection': true,
                        'tabs': itm.childCollections.map((itm, idx) => {
                            return {
                                "id": idx,
                                "active": idx === 0,
                                "label": itm.namePlural,
                                "alias": itm.alias,
                                "collection": itm
                            };
                        })
                    });
                });

            }

            if (!infiniteMode)
            {
                syncTree(vm.content, vm.content.path, true);
            }

            vm.page.listViewPath = ($routeParams.page)
                ? "/" + sectionAlias + "/konstrukt/list/" + vm.content.collectionAlias + "?page=" + $routeParams.page
                : "/" + sectionAlias + "/konstrukt/list/" + vm.content.collectionAlias;
        }

        // Load the editor configuration
        if (isNew) {
             
            vm.page.loading = true;

            // Create an empty item
            konstruktResource.getEntityScaffold(collectionAlias).then(function(data) {
                postLoadContent(data);
                vm.page.loading = false;
            });

        } else {
            
            vm.page.loading = true;

            // Create an empty item
            konstruktResource.getEntityById(collectionAlias, id).then(function (data) {
                postLoadContent(data);
                vm.page.loading = false;
            });

        }

        // load audit trail and redirects when on the info tab
        evts.push(eventsService.on("app.tabChange", function (event, args) {
            if (args.isCollection) {
                var myApp = _.find(vm.page.navigation, (a) => a.alias == args.alias);
                if (myApp) {
                    vm.currentApp = myApp;
                }
            }
            $timeout(function () {
                $(window).trigger('resize.tabsNav');
            });
        }));

        //ensure to unregister from all events!
        $scope.$on('$destroy', function () {
            for (var e in evts) {
                eventsService.unsubscribe(evts[e]);
            }
        });

        $scope.$on("konstrukt.entityDeleted", function (evt, args) {
            if (args.collectionAlias === collectionAlias && args.entityIds.includes(id)) {
                vm.back();
            }
        });

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.EditController", editController);

})();