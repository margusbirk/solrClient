'use strict';

app.service('escapeService', [escapeService]);

function escapeService() {
    var service = {
        escapeSolrSpecialChars: escapeSolrSpecialChars
    };
    return service;
    //regex töötab aga vajab kontrollimist
    function escapeSolrSpecialChars(unescapedLink) {
        return unescapedLink.replace(/[\+\-\&&\||\!\(\)\{\}\[\]\^\"\~\*\?\:]/g, "\\$&");
    };
};