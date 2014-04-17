'use strict';

var app = angular.module('app', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/landing', {
                templateUrl: 'app/landing/landing.html',
                controller: 'landingController'
            })
            .when('/feed', {
                templateUrl: 'app/feed/feed.html',
                controller: 'feedController'
            })
            .when('/feeditem', {
                templateUrl: 'app/feeditem/feeditem.html',
                controller: 'feeditemController'
            });
        //.otherwise({
        //    redirectTo: '/reroutecatch'
        //});
    }]);