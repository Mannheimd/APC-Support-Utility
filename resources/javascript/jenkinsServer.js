var jenkinsServerArray;
function getJenkinsServers (callback, forceReload = false) {
    if (jenkinsServerArray != null && !forceReload) {
        callback();
    }
    else {
        $.ajax({
            type: "GET",
            url: "resources/data/jenkinsservers.json",
            dataType: "json",
            success: (function(data) {
                jenkinsServerArray = [];
                for (var i = 0; i < data.servers.length; i++) { // Create a jenkinsServer object, store it in jenkinsServerArray
                    jenkinsServerArray.push(new jenkinsServer(data.servers[i]));
                }
                callback(data);
            })
        });
    }
}

function jenkinsServer (jsonData) {
    this.name = jsonData.name;
    this.id = jsonData.id;
    this.isProduction = jsonData.isProduction;
    this.url = jsonData.url;
    this.isConfigured = false;
    this.userName = null;
    this.apiToken = null;
}

jenkinsServer.prototype.getAuthInfo = function() {
    if (localStorage.getItem(this.id + "LoginToken")) {
        this.isConfigured = true;
    }
}