'use strict';

var yuliaApp = angular.module('yuliaApp', []);

yuliaApp.controller('WorkController', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('data.json').success(function (data) {
            $scope.works = data.data;
        });

        $scope.predicate = 'technical.added';
        $scope.reverse = false;
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };
    }]
);

yuliaApp.directive('myColumnHeader', function() {
    return {
        restrict: "EA",
        transclude: true,
        scope: {
            predicate: "=predicate",
            reverse: "=reverse",
            value: "@value"
        },
        templateUrl: 'column-header.html'
    };
});