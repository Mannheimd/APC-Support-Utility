var _jenkinsServers
function getJenkinsServers (callback, forceReload = false) {
    if (_jenkinsServers == null && !forceReload) {
        callback(_jenkinsServers);
    }
    else {
        $.ajax({
            type: "GET",
            url: "resources/data/jenkinsservers.json",
            dataType: "json",
            success: (function(data) {
                _jenkinsServers = data;
                for (var i = 0; i < _jenkinsServers.servers.length; i++) { // Check if login credentials are stored
                    if (localStorage.getItem(this.id + "LoginToken")) {
                        this.isConfigured = true;
                    }
                }
                callback(data);
            })
        });
    }
}