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
                    var server = jenkinsServer(data.servers[i]) 
                    jenkinsServerArray.push(server);
                }
            })
        });
    }
}

function jenkinsServer(jsonData) {
    var data = jsonData;
    data.configListItemId = "jenkinsServerConfigListItem" + data.id;
    data.configListItemHtml = processConfigListItemTemplate($("#jenkinsServerConfigListItemTemplate").html());
    
    insertConfigListItem();
    updateLoginStatus();

    function updateLoginStatus() {
        $("#" + data.configListItemId + "LoginStatus").text("Checking...");
        switchLoginPrompt("checking");
        if (jenkinsServer.prototype.getLoginToken(data.id) == undefined) {
            $("#" + data.configListItemId + "LoginStatus").text("Not configured");
            switchLoginPrompt("notConfigured");
        } else {
            jenkinsApi.prototype.getCurrentUser(data.url, data.id, function(response) {
                if (response.status == "success") {
                    data.currentUser = response.data;
                    $("#" + data.configListItemId + "LoginStatus").text("Logged in as " + data.currentUser.fullName);
                    switchLoginPrompt("loggedIn");
                } else {
                    $("#" + data.configListItemId + "LoginStatus").text("Connection failed");
                    switchLoginPrompt("loginFailed");
                }
            })
        }
    }

    function insertConfigListItem() {
        addConfigListListItem();
        updateConfigListItemFields();
        addLoginSubmitEventListener();
        addForgetButtonEventListener();
    }

    function processConfigListItemTemplate(html) {
        return replaceAllInstances(html, "{{configListItemId}}", data.configListItemId)
    }

    function addConfigListListItem() {
        $("#jenkinsServerConfigList").append(data.configListItemHtml);
    }

    function updateConfigListItemFields() {
        $("#" + data.configListItemId + "Name").text(data.name);
    }

    function switchLoginPrompt(switchOption) {
        if (switchOption == "checking") {
            $("#" + data.configListItemId + "LoginSection").hide();
            $("#" + data.configListItemId + "ForgetButton").hide();
        } else if (switchOption == "notConfigured") {
            $("#" + data.configListItemId + "LoginSection").show();
            $("#" + data.configListItemId + "ForgetButton").hide();
        } else if (switchOption == "loginFailed") {
            $("#" + data.configListItemId + "LoginSection").show();
            $("#" + data.configListItemId + "ForgetButton").hide();
        } else if (switchOption == "loggedIn") {
            $("#" + data.configListItemId + "LoginSection").hide();
            $("#" + data.configListItemId + "ForgetButton").show();
        }
    }

    function addLoginSubmitEventListener() {
        var form = $("#" + data.configListItemId + "LoginForm");
        form.on("submit", function(e) {
            params = $("#" + e.target.id).serializeArray();
            jenkinsServer.prototype.addLogin(data.id, params[0].value, params[1].value);
            updateLoginStatus();
            e.preventDefault();
        })
    }

    function addForgetButtonEventListener() {
        var form = $("#" + data.configListItemId + "ForgetButton");
        form.on("click", function() {
            jenkinsServer.prototype.forget(data.id);
            updateLoginStatus();
        })
    }

    return data;
}

jenkinsServer.prototype.getServerById = function(id) {
    return jenkinsServerArray.filter(function(obj) {
        return (obj.id == id);
    })
}

jenkinsServer.prototype.forget = function(id) {
    if (localStorage.getItem(id + "LoginToken")) {
        localStorage.removeItem(id + "LoginToken");
    }
}

jenkinsServer.prototype.getLoginToken = function(id) {
    return localStorage.getItem(id + "LoginToken");
}

jenkinsServer.prototype.addLogin = function(id, username, apiToken) {
    localStorage.setItem(id + "LoginToken", btoa(username + ":" + apiToken));
}