'use strict';

app.service('solrService', ['$q', 'escapeService', '$http', solrService]);

function solrService($q, escapeService, $http) {
    var isCategoriesLoaded;
    var allSources = [];
    var services = {
        getAllResourceCategories: getAllResourceCategories,
        getLatestForCategory: getLatestForCategory,
        getNewsItemByUrl: getNewsItemByUrl,
        getFeedByName: getFeedByName
    };
    return services;

    function getFeedByName(query) {
        var defer = $q.defer();
        var url = "http://uptsearch.cloudapp.net/solr/rss/select?q=source:" + query.feedName + "&wt=json&start=" + query.start + "&rows=9&indent=true&sort=date desc&fl=title,link,date&json.wrf=JSON_CALLBACK";
        console.log("GET " + url);
        $http.jsonp(url).then(querySuccess, queryFailed);
     
        function querySuccess(data) {
            defer.resolve(data.data.response);
        }
        function queryFailed(data, status) {
            console.log('queryfailed');
            defer.reject(status);
        }
        return defer.promise;
    }

    function getNewsItemByUrl(newsItemUrl) {
        var defer = $q.defer();
        var escapedUrl = escapeService.escapeSolrSpecialChars(newsItemUrl);
        var url = "http://uptsearch.cloudapp.net/solr/rss/select?q=link:" + escapedUrl + "&wt=json&rows=1&json.wrf=JSON_CALLBACK";
        console.log('GET ' + url);
        $http.jsonp(url).then(querySuccess, queryFailed);
        function querySuccess(data) {
            if (data.data.response.numFound == 1) {
                console.log(data.data.response.docs[0]);
                defer.resolve(data.data.response.docs[0]);
            }
            else {
                defer.reject("empty response");
            }
        };
        function queryFailed(data, status) {
            defer.reject(status);
        };
        return defer.promise;
    };

    function getAllResourceCategories() {
        var allSourcesUrl = 'http://uptsearch.cloudapp.net/solr/rss/select?q=*%3A*&rows=0&facet=on&facet.field=source&wt=json&json.wrf=JSON_CALLBACK';
        var defer = $q.defer();
        if (isCategoriesLoaded) {
            console.log("List of categories already obtained, returning");
            defer.resolve(allSources);
            return defer.promise;
        };
        var allFeeds = [];
     
        $http.jsonp(allSourcesUrl).then(querySuccess, queryFailed);
        function querySuccess(data) {
            //Siin tuleb response mitte [{name:name, count:count}] vaid [name1, count1, name2, count2] 
            var allCats = data.data.facet_counts.facet_fields.source;
            for (var i = 0; i < allCats.length; i += 2) {
                allFeeds.push({ name: allCats[i], count: allCats[i + 1] });
            }
            isCategoriesLoaded = true;
            allSources = allFeeds;
            defer.resolve(allFeeds);
        };
        function queryFailed(data, status) {
            defer.reject(status);
        };
        return defer.promise;
    }

    function getLatestForCategory(categoryName, limit) {
        var defer = $q.defer();
        var url = "http://uptsearch.cloudapp.net/solr/rss/select?q=source:" + categoryName + "&wt=json&fl=link,title,date&json.wrf=JSON_CALLBACK&sort=date%20desc&rows=" + limit;
        console.log('GET ' + url);
        $http.jsonp(url).then(querySuccess);
        function querySuccess(data) {
            var list = data.data.response.docs;
            defer.resolve(list);
        }
        return defer.promise;
    }

    
}