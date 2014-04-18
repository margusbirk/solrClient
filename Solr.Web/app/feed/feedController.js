'use strict';

app.controller('feedController', ['$scope','$location', 'solrService', feedController]);

function feedController($scope, $location, solrService) {
    $scope.title = "feedController";
    $scope.navigateToSpecific = navigateToSpecific;
    var queryStrings = $location.search();

    activate();

    function activate() {
        $scope.feedName = queryStrings.feedName;
        console.log($scope.feedName);
        solrService.getFeedByName($scope.feedName).then(function (data) {
            console.log(data);
            $scope.feed = data;
        });

    };
    function navigateToSpecific(urlOfFeedItem) {
        $location.path("/feeditem").search({ link: urlOfFeedItem });
    };

}