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
    this.configListItemId = null;

    this.setConfigListItemId();
    this.createConfigListListItem();
    if (this.hasStoredLogin()) {
        configuredServerCount++;
    }
}

jenkinsServer.prototype.setConfigListItemId = function() {
    this.configListItemId = "jenkinsServerConfigListItem" + this.id;
}

jenkinsServer.prototype.hasStoredLogin = function() {
    if (localStorage.getItem(this.id + "LoginToken")) {
        return true;
    }
}

jenkinsServer.prototype.createConfigListListItem = function() {
    this.replaceConfigListIds($("#jenkinsServerConfigListItemTemplate").html());
}

jenkinsServer.prototype.replaceConfigListIds = function(html) {
    var server = this;
    html = replaceAllInstances(html, "{{configListItemId}}", this.configListItemId, function(convertedHtml) {
        server.addConfigListListItem(convertedHtml, server.populateConfigListFields, server);
    })
}

jenkinsServer.prototype.addConfigListListItem = function(html, callback, server) {
    $("#jenkinsServerConfigList").append(html);
    callback(server);
}

jenkinsServer.prototype.populateConfigListFields = function(server) {
    $("#" + server.configListItemId + "Name").text(server.name);
    if (this.isConfigured) {
        this.testLogin(function() {
            $("#" + this.configListItemId + "LoginStatus").text(this.getLoginStatus);
            $("#" + this.configListItemId + "Button").attr("disabled", this.getButtonState);
        })
    }
}

jenkinsServer.prototype.testLogin = function(callback) {
    
}

jenkinsServer.prototype.getLoginStatus = function() {
    return "Implement login status";
}

jenkinsServer.prototype.getButtonState = function() {
    return "";
}

jenkinsServer.prototype.forgetServer = function() {
    if (localStorage.getItem(this.id + "LoginToken")) {
        localStorage.removeItem(this.id + "LoginToken");
    }
}