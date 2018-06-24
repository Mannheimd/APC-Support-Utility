function jenkinsServerConfigListItemTemplate(server, callback) {
    var _jenkinsServerConfigListItemTemplate = null;

    if (_jenkinsServerConfigListItemTemplate != null) {
        callback(server, _jenkinsServerConfigListItemTemplate);
    }
    else {
        readTemplateFile("resources/htmlTemplates/jenkinsServerConfigListItem.html", function(data) {
            _jenkinsServerConfigListItemTemplate = data;
            callback(server, _jenkinsServerConfigListItemTemplate);
        });
    }
}

function readTemplateFile(path, callback) {
    $.ajax({
        type: "GET",
        url: path,
        dataType: "html",
        success: (function(data) {
            callback(data);
        })
    });
}