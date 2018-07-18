function jenkinsApi() {

}

jenkinsApi.prototype.lookupAccount = function(url, id, searchBy, searchFor, callback) {
    var parameters = {};
    parameters.LookupCustomerBy = searchBy;
    parameters.LookupValue = searchFor;

    this.buildAndGetResponse(url, id, "/job/CloudOps1-LookupCustomerMachine/buildWithParameters", parameters, function(response) {
        callback(response);
    });
}

jenkinsApi.prototype.getCurrentUser = function(url, id, callback) {
    this.getRequest(url, id, "/me/api/json", function(response) {
        callback(response);
    });
}

jenkinsApi.prototype.buildAndGetResponse = function(url, id, endpoint, parameters, callback) {
    sendBuildRequest();

    function sendBuildRequest() {
        jenkinsApi.prototype.postRequest(url, id, endpoint, parameters, function(response) {
            if (response.status = "success") {
                getQueuedBuild(response.location);
            }
        });
    }

    function getQueuedBuild(location) {
        jenkinsApi.prototype.getRequest(location, id, "api/json", function(response) {
            if (response.status = "success") {
                alert(JSON.stringify(response));
            }
        });
    }
}

jenkinsApi.prototype.postRequest = function(url, id, endpoint, parameters, callback) {
    var response = {};
    $.ajax({                              
        type: "POST",
        url: url + endpoint,
        data: jQuery.param(parameters),
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + jenkinsServer.prototype.getLoginToken(id));
        },
        success: function(data, successText, xhr) {
            response.data = data;
            response.location = xhr.getResponseHeader("Location");
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

jenkinsApi.prototype.getRequest = function(url, id, endpoint, callback) {
    var response = {};
    $.ajax({                              
        type: "GET",
        url: url + endpoint,
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + jenkinsServer.prototype.getLoginToken(id));
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