var jenkinsServerArray; // Will be an array, not declared here as it's 'reset' by getJenkinsServers()

function getJenkinsServers() {
    configuredServerCount = 0;
    if (jenkinsServerArray != null) {
        callback();
    }
    else {
        $.ajax({
            type: "GET",
            url: "resources/data/jenkinsservers.json",
            dataType: "json",
            success: (function(data) {
                jenkinsServerArray = [];
                for (var i = 0; i < data.servers.length; i++) {
                    var server = jenkinsServer(data.servers[i]) 
                    jenkinsServerArray.push(server);
                }
            })
        });
    }
}

function jenkinsServer(jsonData) {
    var data = jsonData;
    data.configListItemHtml = jenkinsServer.prototype.processTemplate($("#jnkSvrCfgListItemTpl").html(), data);
    
    insertConfigListItem();
    updateLoginStatus();

    function updateLoginStatus() {
        $("#jnkSrvCfgListItem" + data.id + "LoginStatus").text("Checking...");
        switchLoginPrompt("checking");
        if (jenkinsServer.prototype.getLoginToken(data.id) == undefined) {
            $("#jnkSrvCfgListItem" + data.id + "LoginStatus").text("Not configured");
            switchLoginPrompt("notConfigured");
        } else {
            jenkinsApi.prototype.getCurrentUser(data.url, data.id, function(response) {
                if (response.status == "success") {
                    data.currentUser = response.data;
                    $("#jnkSrvCfgListItem" + data.id + "LoginStatus").text("Logged in as " + data.currentUser.fullName);
                    switchLoginPrompt("loggedIn");
                } else {
                    $("#jnkSrvCfgListItem" + data.id + "LoginStatus").text("Connection failed");
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

    function addConfigListListItem() {
        $("#jnkSrvCfgList").append(data.configListItemHtml);
    }

    function updateConfigListItemFields() {
        $("#jnkSrvCfgListItem" + data.id + "Name").text(data.name);
    }

    function switchLoginPrompt(switchOption) {
        if (switchOption == "checking") {
            $("#jnkSrvCfgListItem" + data.id + "LoginSection").hide();
            $("#jnkSrvCfgListItem" + data.id + "ForgetButton").hide();
        } else if (switchOption == "notConfigured") {
            $("#jnkSrvCfgListItem" + data.id + "LoginSection").show();
            $("#jnkSrvCfgListItem" + data.id + "ForgetButton").hide();
        } else if (switchOption == "loginFailed") {
            $("#jnkSrvCfgListItem" + data.id + "LoginSection").show();
            $("#jnkSrvCfgListItem" + data.id + "ForgetButton").hide();
        } else if (switchOption == "loggedIn") {
            $("#jnkSrvCfgListItem" + data.id + "LoginSection").hide();
            $("#jnkSrvCfgListItem" + data.id + "ForgetButton").show();
        }
    }

    function addLoginSubmitEventListener() {
        var form = $("#jnkSrvCfgListItem" + data.id + "LoginForm");
        form.on("submit", function(e) {
            params = $("#" + e.target.id).serializeArray();
            jenkinsServer.prototype.addLogin(data.id, params[0].value, params[1].value);
            updateLoginStatus();
            e.preventDefault();
        })
    }

    function addForgetButtonEventListener() {
        var form = $("#jnkSrvCfgListItem" + data.id + "ForgetButton");
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
        // Counter-intuitive, returns an array of results
        // Should only ever be one correct result as ID is unique
        // jenkinsServer.prototype.getServerById(id)[0] is acceptable.
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

jenkinsServer.prototype.processTemplate = function(html, server) {
    htmlAltered = html;
    htmlAltered = replaceAllInstances(htmlAltered, "{{serverId}}", server.id);
    htmlAltered = replaceAllInstances(htmlAltered, "{{serverName}}", server.name);
    return htmlAltered;
}