'use strict';

var app = angular.module('app', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/landing', {
                templateUrl: 'app/landing/landing.html',
                controller: 'landingController'
            }).
            otherwise({
                redirectTo: '/landing'
            });
    }]);