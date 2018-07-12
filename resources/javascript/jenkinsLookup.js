var jenkinsLookupArray;

function newLookup(jenkinsServer, searchBy, searchFor) {
    jenkinsApi.prototype.lookupAccount(jenkinsServer.url, jenkinsServer.id, searchBy, searchFor, function(response) {
        if (response.status == "success") {
            jenkinsLookupArray.push(response.data);
        }
    })
}