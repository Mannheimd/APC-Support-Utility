function jenkinsApi(jenkinsServer, loginToken) {
    this.jenkinsServer = jenkinsServer;
    this.loginToken = loginToken;
}

jenkinsApi.prototype.getCurrentUser = function() {
    this.getRequest("/me/api/json", function(response) {
        if (response.status == "success") {
            this.jenkinsServer.currentUser = response.data;
        }
    });
}

jenkinsApi.prototype.postRequest = function(endpoint, parameters, callback) {
    $.ajax({                              
        type: "POST",
        url: this.jenkinsServer.url + endpoint,
        data: jQuery.param(parameters),
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + this.loginToken);
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

jenkinsApi.prototype.getRequest = function(endpoint, callback) {
    var jenkinsServer = this.jenkinsServer;
    var response = {}
    $.ajax({                              
        type: "GET",
        url: this.jenkinsServer.url + endpoint,
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + this.loginToken);
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