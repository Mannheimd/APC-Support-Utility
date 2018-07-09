$(document).ready(function() {
    getJenkinsServers();
    bindButtonEvents();
    determineStartPage();

    function determineStartPage() {
        if (localStorage.getItem("isConfigured") != "true") {
            changePage("pageContainer", "glacierConfig");
        }
        else {
            changePage("pageContainer", "glcMainUI");
        }
    }

    function bindButtonEvents() {
        $("#jnkSrvCfgFinishedButton").on("click", function() {
            changePage("pageContainer", "glcMainUI");
            localStorage.setItem("isConfigured", "true");
        })

        $("#glcMainUIMenuConfigButton").on("click", function() {
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