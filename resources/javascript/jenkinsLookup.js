var jenkinsLookupArray = [];

function jenkinsLookup(rawLookupResult) {
    var data;
    alert(rawLookupResult);
};

jenkinsLookup.prototype.newLookup = function(jenkinsServer, searchBy, searchFor) {
    jenkinsApi.prototype.lookupAccount(jenkinsServer.url, jenkinsServer.id, searchBy, searchFor, function(response) {
        handleResponse(response)
    })

    function handleResponse(response) {
        var lookup = new jenkinsLookup(response);
        jenkinsLookupArray.push(lookup);
    }
}