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

jenkinsApi.prototype.getDatabaseUsers = function(url, id, databaseName, sqlServer, callback) {
    var parameters = {};
    parameters.DatabaseName = databaseName;
    parameters.SQLServer = sqlServer;

    this.buildAndGetResponse(url, id, "/job/CloudOps1-ListCustomerDatabaseUsers-Machine/buildWithParameters", parameters, function(response) {
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
                waitForQueuedBuild(response.location);
            }
        });
    }

    function waitForQueuedBuild(queueUrl) {
        jenkinsApi.prototype.getRequest(queueUrl, id, "api/json", function(response) {
            if (response.status = "success") {
                if (response.data.executable) {
                    waitForBuildComplete(response.data.executable.url);
                } else {
                    setTimeout(function() {waitForQueuedBuild(queueUrl)}, 250);
                }
            }
        });
    }

    function waitForBuildComplete(buildUrl) {
        jenkinsApi.prototype.getRequest(buildUrl, id, "api/json", function(response) {
            if (response.status = "success") {
                if (response.data.building == false) {
                    getBuildOutput(buildUrl);
                } else {
                    setTimeout(function() {waitForBuildComplete(buildUrl)}, 250);
                }
            }
        });
    }

    function getBuildOutput(buildUrl) {
        jenkinsApi.prototype.getRequest(buildUrl, id, "logText/progressiveText", function(response) {
            if (response.status = "success") {
                callback(response);
            }
        });
    }
}

jenkinsApi.prototype.postRequest = function(url, id, endpoint, parameters, callback) {
    var response = {};
    parameters.delay = 0;
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