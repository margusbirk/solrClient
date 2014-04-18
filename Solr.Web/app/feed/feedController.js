'use strict';

app.controller('feedController', ['$scope','$location', 'solrService', feedController]);

function feedController($scope, $location, solrService) {
    $scope.title = "feedController";
    $scope.navigateToSpecific = navigateToSpecific;
    $scope.getNextFeedItems = getNextFeedItems;
    $scope.getPreviousFeedItems = getPreviousFeedItems;
    var queryStrings = $location.search();
    $scope.resultsPerPage = 9;
    activate();

    function activate() {
        $scope.feedName = queryStrings.feedName;
        console.log($scope.feedName);

        solrService.getFeedByName({feedName: $scope.feedName, start: 0}).then(handleResult);
    };
    function navigateToSpecific(urlOfFeedItem) {
        $location.path("/feeditem").search({ link: urlOfFeedItem });
    };
    function getNextFeedItems() {
        $scope.nextStart = $scope.feedMeta.start + $scope.resultsPerPage;
      
        //only do the query if results are expected
        if ($scope.nextStart <= $scope.feedMeta.numFound) {
            solrService.getFeedByName({ feedName: $scope.feedName, start: $scope.nextStart }).then(handleResult);
        } 
    };
    function getPreviousFeedItems() {
        $scope.nextStart = $scope.feedMeta.start - $scope.resultsPerPage;
        if ($scope.nextStart >= 0) {
            solrService.getFeedByName({ feedName: $scope.feedName, start: $scope.nextStart }).then(handleResult);
        }
    };
    function handleResult(data) {
        console.log("----------handleResult-------------");
        console.log(data);
        console.log(data.numFound);
        console.log(data.start);
        $scope.feed = data.docs;
        $scope.feedMeta = { numFound: data.numFound, start: data.start };
        console.log($scope.feedMeta);
        console.log("----------handleResult-------------");

    };
}