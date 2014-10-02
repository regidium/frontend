/**
 *  App common directives
 */
(function(angular) {

    'use strict';

    angular.module('regidiumApp.commonDirectives', [])

    /**
     * render issue html template
     */
    .directive('agentIssue', function() {
        return {
            restrict: 'A',
            templateUrl: '/js/app/agent/views/main/issue.html'
        };
    })

    /**
     *  render login html template
     */
    .directive('authLogin', function() {
        return {
            restrict: 'A',
            templateUrl: '/js/app/main/views/auth/login.html'
        };
    })

    /**
     *  render registration html template
     */
    .directive('authRegistration', function() {
        return {
            restrict: 'A',
            templateUrl: '/js/app/main/views/auth/registration.html'
        };
    })

    /**
     *  Directive compare equality
     *  values of elements
     */
    .directive('uiEqualTo', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {

                function validateEqual(myValue, otherValue) {
                    if (myValue === otherValue) {
                        ctrl.$setValidity('equal', true);
                        return myValue;
                    } else if (myValue == undefined && otherValue == undefined) {
                        return true;
                    } else {
                        ctrl.$setValidity('equal', false);
                        return myValue;
                    }
                }

                scope.$watch(attrs.uiEqualTo, function (otherModelValue) {
                    validateEqual(ctrl.$viewValue, otherModelValue);
                });

                ctrl.$parsers.unshift(function (viewValue) {
                    return validateEqual(viewValue, scope.$eval(attrs.uiEqualTo));
                });

                ctrl.$formatters.unshift(function (modelValue) {
                    return validateEqual(modelValue, scope.$eval(attrs.uiEqualTo));
                });
            }
        };
    })

    /**
     * Directive auto scroll
     * on elem height change
     */
    .directive('autoScroll', function () {
        return {
            restrict: 'A',
            link: function(scope, $el, attrs) {
                scope.$watch(function() {
                    $el[0].scrollTop = $el[0].scrollHeight;
                });
            }
        };
    })

    /*
     * Unused directive
     *
    .directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
        // contains
        function contains(arr, item) {
            if (angular.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (angular.equals(arr[i], item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // add
        function add(arr, item) {
            arr = angular.isArray(arr) ? arr : [];
            for (var i = 0; i < arr.length; i++) {
                if (angular.equals(arr[i], item)) {
                    return arr;
                }
            }
            arr.push(item);
            return arr;
        }

        // remove
        function remove(arr, item) {
            if (angular.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (angular.equals(arr[i], item)) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            return arr;
        }

        // http://stackoverflow.com/a/19228302/1458162
        function postLinkFn(scope, elem, attrs) {
            // compile with `ng-model` pointing to `checked`
            $compile(elem)(scope);

            // getter / setter for original model
            var getter = $parse(attrs.checklistModel);
            var setter = getter.assign;

            // value added to list
            var value = $parse(attrs.checklistValue)(scope.$parent);

            // watch UI checked change
            scope.$watch('checked', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                var current = getter(scope.$parent);
                if (newValue === true) {
                    setter(scope.$parent, add(current, value));
                } else {
                    setter(scope.$parent, remove(current, value));
                }
            });

            // watch original model change
            scope.$parent.$watch(attrs.checklistModel, function(newArr, oldArr) {
                scope.checked = contains(newArr, value);
            }, true);
        }

        return {
            restrict: 'A',
            priority: 1000,
            terminal: true,
            scope: true,
            compile: function(tElement, tAttrs) {
                if (tElement[0].tagName !== 'INPUT' || !tElement.attr('type', 'checkbox')) {
                    throw 'checklist-model should be applied to `input[type="checkbox"]`.';
                }

                if (!tAttrs.checklistValue) {
                    throw 'You should provide `checklist-value`.';
                }

                // exclude recursion
                tElement.removeAttr('checklist-model');

                // local scope var storing individual checkbox model
                tElement.attr('ng-model', 'checked');
                return postLinkFn;
            }
        };
    }])
    */


})(angular);