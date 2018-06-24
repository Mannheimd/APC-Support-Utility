var jenkinsServerArray;
var configuredServerCount = 0;

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
                callback();
            })
        });
    }
}

function jenkinsServer (jsonData) {
    this.name = jsonData.name;
    this.id = jsonData.id;
    this.isProduction = jsonData.isProduction;
    this.url = jsonData.url;
    this.configListItemId = "jenkinsServerConfigListItem" + this.id;
    this.isConfigured = false;
    this.userName = null;
    this.apiToken = null;

    this.createListItem();
}

jenkinsServer.prototype.getAuthInfo = function() {
    if (localStorage.getItem(this.id + "LoginToken")) {
        this.isConfigured = true;
        configuredServerCount++;
    }
}

jenkinsServer.prototype.replaceIds = function(server, html) {
    html = replaceAllInstances(html, "{{configListItemId}}", this.configListItemId, function(convertedHtml) {
        server.addListItem(convertedHtml);
    })
}

jenkinsServer.prototype.createListItem = function() {
    jenkinsServerConfigListItemTemplate(this, function(server, html) {
        data = server.replaceIds(server, html);
    })
}

jenkinsServer.prototype.addListItem = function(html) {
    $("#jenkinsServerConfigList").append(html);
}