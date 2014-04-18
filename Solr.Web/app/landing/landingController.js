'use strict';

app.controller('landingController', ['$scope', '$location', 'solrService', landingController]);

function landingController($scope, $location, solrService) {
    $scope.title = "Here you can see all feeds";
    $scope.allFeeds = [];
    $scope.loadFeedItems = loadFeedItems;
    $scope.navigateToFeed = navigateToFeed;
    $scope.navigateToSpecific = navigateToSpecific;

    activate();

    function activate() {
        solrService.getAllResourceCategories().then(function (data) {
            $scope.allFeeds = data;
            $scope.loadFeedItems();
        });
    };

    function navigateToFeed(feedName) {
        $location.path("/feed").search({feedName:feedName});
    };

    function navigateToSpecific(urlOfFeedItem) {
        $location.path("/feeditem").search({link:urlOfFeedItem});
    }

    function loadFeedItems() {
        //testimise käigus ainult 1 päring
        //solrService.getLatestForCategory($scope.allFeeds[0].name, 3).then(function (data) {
        //    $scope.allFeeds[0].recentFeedItems = data;
        //});
        $scope.allFeeds.forEach(function(feedCategory) {
            solrService.getLatestForCategory(feedCategory.name, 3).then(function(data) {
                feedCategory.recentFeedItems = data;
            });
        });
    };
};