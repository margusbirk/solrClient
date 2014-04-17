'use strict';

app.controller('feeditemController', ['$scope', '$location', '$sce', 'solrService', feeditemController]);

function feeditemController($scope, $location, $sce, solrService) {
    $scope.title = "feeditemController";
    $scope.escapeMe = "tere";
    $scope.escape = escape;
    $scope.querystrings = $location.search();
    activate();

    function allowHtml(html) {
        return $sce.trustAsHtml(html);
    }

    function activate() {
        console.log($scope.querystrings);
        console.log($scope.querystrings.link);
        console.log(typeof ($scope.querystrings.link));
        if (typeof($scope.querystrings.link) === "string") {
            solrService.getNewsItemByUrl($scope.querystrings.link).then(function (data) {
                console.log('got back this' + data);
                data.description = allowHtml(data.description);
                $scope.feedItem = data;
            });
        }
    }
    function escape(toBeEscaped) {
        console.log('starting escaping on: ' + toBeEscaped);
        //return toBeEscaped.replace(/[\:\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        return toBeEscaped.replace(/[\+\-\&&\||\!\(\)\{\}\[\]\^\"\~\*\?\:]/g, "\\$&");
    };
}