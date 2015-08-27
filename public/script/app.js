'use strict';

var yuliaApp = angular.module('yuliaApp', []);

yuliaApp.controller('workCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('data.json').success(function (data) {
            $scope.works = data.data;
        });
    }]);