// Required Notice: 
// - Copyright Outfield Digital Ltd
//   https://outfield.digital

(function () {

    'use strict';

    function dateRangeFilterController($scope) {

        var toPicker;

        $scope.fromConfig = {
            dateFormat: "Y-m-d",
            showMonths: 1,
            enableTime: false,
            onReady: function (dateObj, dateStr, instance) {
                instance.input.placeholder = "From";
                var $this = $(instance.calendarContainer);
                if ($this.find('.flatpickr-clear').length < 1) {
                    $this.append('<div class="flatpickr-clear">Clear</div>');
                    $this.find('.flatpickr-clear').on('click', function () {
                        instance.clear();
                        instance.close();
                        $scope.model.value[0] = undefined;
                    });
                }
            },
            onChange: function (selectedDates, dateStr, instance) {
                $scope.model.value[0] = dateStr;
                toPicker.set("minDate", selectedDates.length > 0 ? selectedDates[0] : undefined);
            },
            onValueUpdate: function (selectedDates, dateStr, instance) {
                $scope.model.value[0] = dateStr;
                toPicker.set("minDate", selectedDates.length > 0 ? selectedDates[0] : undefined);
            }
        };

        $scope.toConfig = {
            dateFormat: "Y-m-d",
            showMonths: 1,
            enableTime: false,
            onReady: function (dates, dateStr, instance) {
                toPicker = instance;
                instance.input.placeholder = "To";
                var $this = $(instance.calendarContainer);
                if ($this.find('.flatpickr-clear').length < 1) {
                    $this.append('<div class="flatpickr-clear">Clear</div>');
                    $this.find('.flatpickr-clear').on('click', function () {
                        instance.clear();
                        instance.close();
                        $scope.model.value[1] = undefined;
                    });
                }
            },
            onChange: function (selectedDates, dateStr, instance) {
                $scope.model.value[1] = dateStr;
            },
            onValueUpdate: function (selectedDates, dateStr, instance) {
                $scope.model.value[1] = dateStr;
            }
        };

        function init() {
            if (!$scope.model.value)
                $scope.model.value = [,];
        }

        init();

        $scope.$watch("model.value", function () {
            init();
        });

    }

    angular.module("umbraco").controller("Konstrukt.Controllers.DateRangeFilterController", dateRangeFilterController);

})();