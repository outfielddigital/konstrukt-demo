// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function konstruktCards($location, konstruktResource, editorService) {

        function link($scope, el, attr, ctrl) {
            
        }

        var directive = {
            restrict: 'E',
            replace: true,
            template: `<div>
    <div class="konstrukt-cards umb-packages" ng-if="cards && cards.length > 0">
        <konstrukt-card ng-repeat="card in cards" card="card" collection-alias="collectionAlias" parent-entity-id="parentEntityId"></konstrukt-card>
    </div>
</div>`,
            scope: {
                collectionAlias: '=',
                cards: '=',
                parentEntityId: '<?'
            },
            link: link
        };

        return directive;

    }

    angular.module("umbraco.directives").directive("konstruktCards", konstruktCards);
    

    function konstruktCard($location, konstruktResource) {

        function link($scope, el, attr, ctrl) {
        
            $scope.value = "-";

            konstruktResource.getCardValue($scope.collectionAlias, $scope.card.alias, $scope.parentEntityId).then(function (val) {
                $scope.value = val;
            });
        }

        var directive = {
            restrict: 'E',
            replace: true,
            template: `<div class="konstrukt-card umb-package">
<div class="konstrukt-card__icon btn-color-{{ card.color || 'blue' }}">
    <i class="icon {{ card.icon }}" ></i>
</div>
    <div class="konstrukt-card__body">
        <h3>{{ value }}<small class="konstrukt-card__suffix" ng-if="card.suffix">{{ card.suffix }}</small></h3>
        <h4>{{ card.name }}</h4>
    </div>
</div>`,
            scope: {
                collectionAlias: '=',
                card: '=',
                parentEntityId: '<?'
            },
            link: link
        };

        return directive;

    }

    angular.module("umbraco.directives").directive("konstruktCard", konstruktCard);

})();