var jenkinsServerArray;

function getJenkinsServers(forceReload = false) {
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
                    var server = new jenkinsServer(data.servers[i]) 
                    jenkinsServerArray.push(server);
                }
            })
        });
    }
}

function addJenkinsServer() {
    alert("Hello, world!");
}

function jenkinsServer(jsonData) {
    var name = jsonData.name;
    var id = jsonData.id;
    var isProduction = jsonData.isProduction;
    var url = jsonData.url;
    var configListItemId = "jenkinsServerConfigListItem" + id;
    var configListItemHtml = processConfigListItemTemplate($("#jenkinsServerConfigListItemTemplate").html());
    var currentUser = {};
    
    insertConfigListItem();
    updateLoginStatus();

    function updateLoginStatus() {
        $("#" + configListItemId + "LoginStatus").text("Checking...");
        switchLoginPrompt("checking");
        if (jenkinsServer.prototype.getLoginToken(id) == undefined) {
            $("#" + configListItemId + "LoginStatus").text("Not configured");
            switchLoginPrompt("notConfigured");
        } else {
            jenkinsApi.prototype.getCurrentUser(url, id, function(response) {
                if (response.status == "success") {
                    currentUser = response.data;
                    $("#" + configListItemId + "LoginStatus").text("Logged in as " + currentUser.fullName);
                    switchLoginPrompt("loggedIn");
                } else {
                    $("#" + configListItemId + "LoginStatus").text("Connection failed");
                    switchLoginPrompt("loginFailed");
                }
            })
        }
    }

    function insertConfigListItem() {
        addConfigListListItem();
        updateConfigListItemFields();
    }

    function processConfigListItemTemplate(html) {
        return replaceAllInstances(html, "{{configListItemId}}", configListItemId)
    }

    function addConfigListListItem() {
        $("#jenkinsServerConfigList").append(configListItemHtml);
    }

    function updateConfigListItemFields() {
        $("#" + configListItemId + "Name").text(name);
    }

    function switchLoginPrompt(switchOption) {
        if (switchOption == "checking") {
            $("#" + configListItemId + "LoginSection").hide();
            $("#" + configListItemId + "ForgetButton").hide();
        } else if (switchOption == "notConfigured") {
            $("#" + configListItemId + "LoginSection").show();
            $("#" + configListItemId + "ForgetButton").hide();
        } else if (switchOption == "loginFailed") {
            $("#" + configListItemId + "LoginSection").show();
            $("#" + configListItemId + "ForgetButton").hide();
        } else if (switchOption == "loggedIn") {
            $("#" + configListItemId + "LoginSection").hide();
            $("#" + configListItemId + "ForgetButton").show();
        }
    }
}

jenkinsServer.prototype.forget = function(server) {
    if (localStorage.getItem(server.id + "LoginToken")) {
        localStorage.removeItem(server.id + "LoginToken");
    }
}

jenkinsServer.prototype.getLoginToken = function(id) {
    return localStorage.getItem(id + "LoginToken");
}