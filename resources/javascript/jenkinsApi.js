function jenkinsApi(jenkinsServer) {
    this.jenkinsServer = jenkinsServer;
}

jenkinsApi.prototype.getCurrentUserInfo = function() {
    
}

jenkinsApi.prototype.postRequest = function(endpoint, parameters) {
    $.ajax({                              
        type: "POST",
        url: this.jenkinsServer.url + endpoint,
        data: jQuery.param(parameters),
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + jenkinsServer.getLoginToken());
        },
        success: function(data) {
            return data;
        }
    });
}

jenkinsApi.prototype.getRequest = function(endpoint) {
    var jenkinsServer = this.jenkinsServer;
    $.ajax({                              
        type: "GET",
        url: this.jenkinsServer.url + endpoint,
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + jenkinsServer.getLoginToken());
        },
        success: function(data) {
            return data;
        }
    });
}