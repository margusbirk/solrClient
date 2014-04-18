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
            console.log(data.numFound);
            console.log(data.start);
            $scope.feed = data.docs;
            $scope.feedMeta = { total: data.numFound, start: data.start };
        });
    };
    function navigateToSpecific(urlOfFeedItem) {
        $location.path("/feeditem").search({ link: urlOfFeedItem });
    };

}