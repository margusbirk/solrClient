'use strict';

app.service('solrService', ['$q', 'escapeService', solrService]);

function solrService($q, escapeService) {
    var allSourcesUrl = 'http://uptsearch.cloudapp.net/solr/rss/select?q=*%3A*&rows=0&facet=on&facet.field=source&wt=json';
    var isCategoriesLoaded;
    var allSources = [];
    var services = {
        getAllResourceCategories: getAllResourceCategories,
        getLatestForCategory: getLatestForCategory,
        getNewsItemByUrl: getNewsItemByUrl,
        getFeedByName: getFeedByName
    };
    return services;

    function getFeedByName(feedName) {
        var defer = $q.defer();
        var url = "http://uptsearch.cloudapp.net/solr/rss/select?q=source:" + feedName + "&wt=json&sort=date desc";
        $.ajax({ url: url, method: "get", dataType: 'jsonp', jsonp: 'json.wrf' })
            .success(querySuccess).fail(queryFailed);

        function querySuccess(data) {
            defer.resolve(data.response.docs);
        }
        function queryFailed(data, status) {
            defer.reject(status);
        }
        return defer.promise;
    }

    function getNewsItemByUrl(newsItemUrl) {
        var defer = $q.defer();
        var escapedUrl = escapeService.escapeSolrSpecialChars(newsItemUrl);
        var url = "http://uptsearch.cloudapp.net/solr/rss/select?q=link:" + escapedUrl + "&wt=json&rows=1";
        console.log('GET ' + url);
        $.ajax({ url: url, method: "get", dataType: "jsonp", jsonp: "json.wrf" })
            .success(querySuccess)
            .fail(queryFailed);

        function querySuccess(data) {
            if (data.response.numFound == 1) {
                console.log(data.response.docs[0]);
                defer.resolve(data.response.docs[0]);
            } else {
                defer.reject();
            }
        };
        function queryFailed(data, status) {
            defer.reject(status);
        };
        return defer.promise;
    };

    function getAllResourceCategories() {
        //Todo: queryfailed local scope
        var defer = $q.defer();
        if (isCategoriesLoaded) {
            console.log("List of categories already obtained, returning");
            defer.resolve(allSources);
            return defer.promise;
        };
        var allFeeds = [];
        $.ajax({
            url: allSourcesUrl,
            method: 'get',
            dataType: 'jsonp',
            jsonp: 'json.wrf'
        }).success(querySuccess).fail(queryFailed);

        function querySuccess(data) {
            //Siin tuleb response mitte [{name:name, count:count}] vaid [name1, count1, name2, count2] 
            var allCats = data.facet_counts.facet_fields.source;
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
        if (typeof (limit) === "undefined") {
            limit = 3;
        }
        if (typeof (categoryName) == "undefined") {
            console.log("categoryName missing, cannot continue");
            return;
        }
        var defer = $q.defer();
        var url = "http://uptsearch.cloudapp.net/solr/rss/select?q=source:" + categoryName + "&wt=json&sort=date%20desc&rows=" + limit;
        console.log('GET ' + url);
        $.ajax({ url: url, method: "get", dataType: "jsonp", jsonp: "json.wrf" }).then(querySuccess);

        function querySuccess(data) {
            var list = data.response.docs;
            defer.resolve(list);
        }
        return defer.promise;
    }

    
}