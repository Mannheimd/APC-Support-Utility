$(document).ready(function() {
    getJenkinsServers(function () {
        changePage("pageContainer", "glacierMainUI");
    });
});

$("#lookupCustomerSubmit").click(function () {
    lookupCustomer();
})

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