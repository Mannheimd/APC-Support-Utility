function jenkinsApi(jenkinsServer) {
    this.jenkinsServer = jenkinsServer;
    this.loginToken = jenkinsServer.getLoginToken();
}

jenkinsApi.prototype.getCurrentUser = function(callback) {
    this.getRequest("/me/api/json", this.loginToken, function(response) {
        callback(response);
    });
}

jenkinsApi.prototype.postRequest = function(endpoint, parameters, loginToken, callback) {
    var response = {};
    $.ajax({                              
        type: "POST",
        url: this.jenkinsServer.url + endpoint,
        data: jQuery.param(parameters),
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + loginToken);
        },
        success: function(data) {
            response.data = data;
        },
        complete: function(xhr, status) {
            response.status = status;
            response.xhr = xhr;
            if (callback) {
                callback(response);
            }
        }
    });
}

jenkinsApi.prototype.getRequest = function(endpoint, loginToken, callback) {
    var response = {};
    $.ajax({                              
        type: "GET",
        url: this.jenkinsServer.url + endpoint,
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + loginToken);
        },
        success: function(data) {
            response.data = data;
        },
        complete: function(xhr, status) {
            response.status = status;
            response.xhr = xhr;
            if (callback) {
                callback(response);
            }
        }
    });
}