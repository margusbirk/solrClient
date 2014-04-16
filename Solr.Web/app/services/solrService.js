'use strict';

app.service('solrService', ['$q', solrService]);

function solrService($q) {
    var baseUrl = 'http://uptsearch.cloudapp.net/solr/rss/select';
    var allSourcesUrl = 'http://uptsearch.cloudapp.net/solr/rss/select?q=*%3A*&rows=0&facet=on&facet.field=source&wt=json';
    var isResourcesLoaded;
    var allSources = [];
    var services = {
        getAllResourceCategories: getAllResourceCategories,
        getLatestForCategory: getLatestForCategory
    };
    return services;

    function getAllResourceCategories() {
        if (isResourcesLoaded) {
            console.log("List of categories already obtained, returning");
            return allSources;
        };
        var defer = $q.defer();
        var allFeeds = [];
        $.ajax({
            url: allSourcesUrl,
            method: 'get',
            dataType: 'jsonp',
            jsonp: 'json.wrf'
        }).then(querySuccess);
            //.success(querySuccess).error(_queryFailed);

        function querySuccess(data) {
            //Siin tuleb response mitte [{name:name, count:count}] vaid [name, count, name, count] 
            var allCats = data.facet_counts.facet_fields.source;
            for (var i = 0; i < allCats.length; i += 2) {
                allFeeds.push({ name: allCats[i], count: allCats[i + 1] });
            }
            isResourcesLoaded = true;
            allSources = allFeeds;
            defer.resolve(allFeeds);
        }
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
        var url = "http://uptsearch.cloudapp.net/solr/rss/select?q=source:"+categoryName+"&wt=json&indent=true&sort=date%20asc&rows="+limit;
        console.log('GET ' + url);
        $.ajax({ url: url, method: "get", dataType: "jsonp", jsonp: "json.wrf" }).then(querySuccess);

        function querySuccess(data) {
            var list = data.response.docs;
            defer.resolve(list);
        }

        return defer.promise;
    }

    function _queryFailed(data, status) {
       console.log("Error status: "  + status + " data: " + data);
       
   }
}