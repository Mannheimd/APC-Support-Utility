var environmentList = []; //Lists all of the available Jenkins environments

// On page load, read /resources/data/jenkinsEnvironments.xml for the list of Jenkins environments that are available to connect to.
$(document).ready(function() {
    getJenkinsServers(function (data) {
        alert("Loaded Jenkins servers 2");
    });
});

$("#lookupCustomerSubmit").click(function () {
    lookupCustomer();
})