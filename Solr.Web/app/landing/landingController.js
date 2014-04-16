'use strict';

app.controller('landingController', ['$scope', 'solrService', landingController]);

function landingController($scope, $solrService) {
    $scope.title = "Le Title";

    $scope.allFeeds = [];
    $scope.loadFeedItems = loadFeedItems;
    $scope.test = test;

    function test() {
        console.log('cck received');
        console.log(typeof ($solrService));
        $solrService.getAllResourceCategories().then(function(data) {
            $scope.allFeeds = data;
          //  $solrService.getLatestForCategory($scope.allFeeds[0].name, 3);
            $scope.loadFeedItems();
        });
    };

    function loadFeedItems() {
        $scope.allFeeds.forEach(function(feedCategory) {
            $solrService.getLatestForCategory(feedCategory.name, 3).then(function(data) {
                feedCategory.recentFeedItems = data;
            });
        });
    };
};