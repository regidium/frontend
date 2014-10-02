/**
 * App common filters
 */
(function(angular) {

    'use strict';

    angular.module('regidiumApp')

    /**
     *  Filter for order items
     *
     *  @param items                items to order
     *  @param field                order by
     *  @param {boolean} reverse    ASC/DESC
     */
    .filter('orderObjectBy', function() {
      return function(items, field, reverse) {
        var filtered = [];

        angular.forEach(items, function(item) {
            filtered.push(item);
        });

        filtered.sort(function (a, b) {
            return (a[field] > b[field]);
        });

        if(reverse) {
            filtered.reverse();
        }

        return filtered;
      };
    })

})(angular);