var jenkinsServerArray;

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
    name = jsonData.name;
    id = jsonData.id;
    isProduction = jsonData.isProduction;
    url = jsonData.url;
    configListItemId = "jenkinsServerConfigListItem" + id;
    configListItemHtml = this.processConfigListItemTemplate($("#jenkinsServerConfigListItemTemplate").html());
    jenkinsClient = new jenkinsApi(this, this.getLoginToken());
    jenkinsUserInfo = {};
    currentUser = {};
    
    this.insertConfigListItem(configListItemHtml);

    this.updateLoginStatus();
}

jenkinsServer.prototype.insertConfigListItem = function() {
    this.addConfigListListItem();
    this.updateConfigListItemFields();
}

jenkinsServer.prototype.processConfigListItemTemplate = function(html) {
    return replaceAllInstances(html, "{{configListItemId}}", configListItemId)
}

jenkinsServer.prototype.addConfigListListItem = function() {
    $("#jenkinsServerConfigList").append(configListItemHtml);
}

jenkinsServer.prototype.updateConfigListItemFields = function() {
    $("#" + configListItemId + "Name").text(name);
}

jenkinsServer.prototype.getLoginToken = function() {
    return localStorage.getItem(id + "LoginToken");
}

jenkinsServer.prototype.updateLoginStatus = function() {
    if (this.getLoginToken() == undefined) {
        $("#" + configListItemId + "LoginStatus").text("Not configured");
        return;
    }

    var server = this;
    jenkinsClient.getCurrentUser(function(response) {
        if (response.status == "success") {
            server.currentUser = response.data;

            $("#" + server.configListItemId + "LoginStatus").text("Logged in as " + jenkinsServer.currentUser.fullName);
        } else {
            $("#" + server.configListItemId + "LoginStatus").text("Login failed");
        }
    })
}

jenkinsServer.prototype.forgetServer = function() {
    if (localStorage.getItem(this.id + "LoginToken")) {
        localStorage.removeItem(this.id + "LoginToken");
    }
}