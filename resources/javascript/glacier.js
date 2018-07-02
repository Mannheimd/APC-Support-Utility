$(document).ready(function() {
    var startupFunctions = [
        getJenkinsServers(),
        determineStartPage()
    ]
    
    functionSeries(startupFunctions);
});

function determineStartPage() {
    if (configuredServerCount == 0) {
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