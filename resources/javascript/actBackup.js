var backupCount = 0;

function actBackup(backupText, database) {
    var backup = {};
    backup.number = backupCount;
    backupCount++;

    backup.database = database;

    parseBackupText();

    return backup;

    function parseBackupText() {
        backup.fileName = findString(backupText, "{filename=", "}");
        if (backup.fileName) {
            // Since this will only make sense if you can see a file name, I'll break down an example:
            // ust1-ust1-actsql-09-A7618204128-201807230200-full.bak
            var fileNameSplitAfterDBName = backup.fileName.split(backup.database.name + "-")[1];
            // 201807230200-full.bak
            var fileNameSplit = fileNameSplitAfterDBName.split("-")
            var dateTimeString = fileNameSplit[0];
            // 201807230200
            backup.dateTime = Date.parseString(dateTimeString, "yyyyMMddHHmm");

            backup.type = fileNameSplit[1].substring(0, 4);
            // full
        }
    }

    function findString(text, startString, endString) {
        if (text == undefined) {return undefined};
        text = text.split(startString)[1];
        if (text == undefined) {return undefined};
        text = text.split(endString)[0];
        return text;
    }
}

actBackup.prototype.addBackupListItem = function(backup, targetList, database) {
    backup.listItemHtml = actBackup.prototype.processTemplate($("#glcLookupActBackupListItemTpl").html(), backup);
    $(targetList).append(backup.listItemHtml);
    var listItem = $("#glcLookupActBackupListItem" + backup.number);
    listItem.on("click", function() {
        actDatabase.prototype.setSelectedBackup(database, backup);
        actBackup.prototype.switchToBackup(backup);
    })
}

actBackup.prototype.switchToBackup = function(backup) {
    backup.detailsHtml = actBackup.prototype.processTemplate($("#glcLookupActBackupDetailsTpl").html(), backup);
    $("#glcLookupBackupDetails").html(backup.detailsHtml);

    actBackup.prototype.addButtonBindings(backup);
    addExpandoButtonFunction($("#glcLookupBackupDetails"));

    var listItem = $("#glcLookupActBackupListItem" + backup.number);
    listItem.prop("checked", true);
}

actBackup.prototype.processTemplate = function(html, backup) {
    htmlAltered = html;
    htmlAltered = replaceAllInstances(htmlAltered, "{{backupNumber}}", backup.number);
    htmlAltered = replaceAllInstances(htmlAltered, "{{fileName}}", backup.fileName);
    htmlAltered = replaceAllInstances(htmlAltered, "{{dateTime}}", backup.dateTime);
    return htmlAltered;
}

actBackup.prototype.addButtonBindings = function(backup) {
    $("#glcBackupDetailsScreenSelection").on("click", "ul > li", function(e) {
        backup.screenSelectionPageId = $(e.target).attr("data-pageId");
        actBackup.prototype.setScreenSelectionPage(backup);
    })
        
    $("#glcLookupRetainBackupForm").on("submit", function(e) {
        var params = $("#" + e.target.id).serializeArray();

        // params left in for future compatibility, but not needed here
        if (checkFormFieldsComplete(params, 0)) {
            actBackup.prototype.retainBackup(backup);
        }

        e.preventDefault();
    })
}

actBackup.prototype.setScreenSelectionPage = function(backup) {
    if (backup.screenSelectionPageId) {
        changePage("glcBackupDetailsScreenSelection", backup.screenSelectionPageId);
        changeTab("glcBackupDetailsScreenSelection", backup.screenSelectionPageId);
    }
}

actBackup.prototype.retainBackup = function(backup) {
    alterUI(true, "Copying backup. This may take a while, don't leave this page.");
    if (backup.type == "diff") {
        handleRequest(backup.full, function(response) {
            if (response.data.indexOf("marked build as failure") != -1) {
                alterUI(false, "Failed to copy backup. Please try again.");
            } else {
                handleRequest(backup, function(response) {
                    if (response.data.indexOf("marked build as failure") != -1) {
                        alterUI(false, "Failed to copy backup. Please try again.");
                    } else {
                        alterUI(false, "Backup files retained. Raise a CloudOps escalation to request a restore, including these file names:</br>" + 
                                        backup.full.fileName + "</br>" +
                                        backup.fileName);
                        return;
                    }
                })
            }
        })
    } else if (backup.type = "full") {
        handleRequest(backup, function(response) {
            if (response.data.indexOf("marked build as failure") != -1) {
                alterUI(false, "Failed to copy backup. Please try again.");
            } else {
                alterUI(false, "Backup file retained. Raise a CloudOps escalation to request a restore, including this file name:</br>" + 
                                backup.fileName);
                return;
            }
        })
    }

    function handleRequest(backupToCopy, callback) {
        jenkinsApi.prototype.copyDatabaseBackup(backupToCopy.database.jenkinsServer.url, backupToCopy.database.jenkinsServer.id, backupToCopy.database.server, backupToCopy.fileName, function(response) {
            callback(response);
        })
    }

    function alterUI(disabled, message) {
        if (disabled) {
            $("#glcLookupRetainBackupForm input").prop("disabled", true);
        } else {
            $("#glcLookupRetainBackupForm input").prop("disabled", false);
        }

        if (message) {
            $("#glcLookupRetainBackupStatus").html(message);
        } else {
            $("#glcLookupRetainBackupStatus").html("");
        }
    }
}