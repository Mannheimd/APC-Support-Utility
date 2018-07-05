$(document).ready(function() {
    getJenkinsServers();
    bindButtonEvents();
    determineStartPage();

    function determineStartPage() {
        if (localStorage.getItem("isConfigured") != "true") {
            changePage("pageContainer", "glacierConfig");
        }
        else {
            changePage("pageContainer", "glacierMainUI");
        }
    }

    function bindButtonEvents() {
        $("#jenkinsServerConfigFinishedButton").on("click", function() {
            changePage("pageContainer", "glacierMainUI");
            localStorage.setItem("isConfigured", "true");
        })

        $("#glacierMainUIMenuConfigButton").on("click", function() {
            changePage("pageContainer", "glacierConfig");
        })
    }
});

function changePage(pageClass, pageContainerId) {
    $("." + pageClass).each(function() {
        if ($(this).attr('id') == pageContainerId) {
            $(this).removeClass('hidden');
        }
        else {
            $(this).addClass('hidden');
        }
    })
}