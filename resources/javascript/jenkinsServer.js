var jenkinsServerArray;
var configuredServerCount;

function getJenkinsServers (forceReload = false) {
    configuredServerCount = 0;
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
    this.configListItemHtml = null;
    this.jenkinsApi = new jenkinsApi(this, this.getLoginToken());
    this.jenkinsUserInfo = null;
    this.currentUser = null;
    
    this.insertConfigListItem();
    if (this.jenkinsApi.loginToken) {
        configuredServerCount++;
    }
}

jenkinsServer.prototype.insertConfigListItem = function() {
    this.setConfigListItemId();
    this.processConfigListItemTemplate($("#jenkinsServerConfigListItemTemplate").html());
    this.addConfigListListItem();
    this.updateConfigListItemFields();
}

jenkinsServer.prototype.setConfigListItemId = function() {
    this.configListItemId = "jenkinsServerConfigListItem" + this.id;
}

jenkinsServer.prototype.processConfigListItemTemplate = function(html) {
    this.configListItemHtml = replaceAllInstances(html, "{{configListItemId}}", this.configListItemId)
}

jenkinsServer.prototype.addConfigListListItem = function() {
    $("#jenkinsServerConfigList").append(this.configListItemHtml);
}

jenkinsServer.prototype.updateConfigListItemFields = function() {
    $("#" + this.configListItemId + "Name").text(this.name);
    if (this.isConfigured) {
        
    }
}

jenkinsServer.prototype.getLoginToken = function() {
    return localStorage.getItem(this.id + "LoginToken");
}

jenkinsServer.prototype.updateLoginStatus = function() {

}

jenkinsServer.prototype.forgetServer = function() {
    if (localStorage.getItem(this.id + "LoginToken")) {
        localStorage.removeItem(this.id + "LoginToken");
    }
}