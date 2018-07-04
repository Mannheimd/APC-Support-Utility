$(document).ready(function() {
    getJenkinsServers();
    determineStartPage();
});

function determineStartPage() {
    if (localStorage.getItem("isConfigured") != "true") {
        changePage("pageContainer", "glacierConfig");
    }
    else {
        changePage("pageContainer", "glacierMainUI");
    }
}

$("#lookupCustomerSubmit").click(function () {
    lookupCustomer();
});

function changePage(pageClass, pageContainerId) {
    $("." + pageClass).each(function() {
        if ($(this).attr('id') == pageContainerId) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    })
}