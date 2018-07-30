var backupCount = 0;

function actBackup(backupText, database) {
    backup = {};
    backup.number = backupCount;
    backupCount++;

    backup.database = database;

    parseBackupText();

    return backup;

    function parseBackupText() {
        backup.fileName = findString(backupText, "{filename=", "}");
        if (filename) {
            // Since this will only make sense if you can see a file name, I'll break down an example:
            // ust1-ust1-actsql-09-A7618204128-201807230200-full.bak
            var fileNameSplitAfterDBName = fileName.split(backup.database.name + "-")[1];
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
    var listItem = $("#glcLookupActBackupListItem" + bacup.number);
    listItem.on("click", function() {
        actDatabase.prototype.setSelectedBackup(database, backup);
        actBackup.prototype.switchToBackup(backup);
    })
}

actBackup.prototype.switchToBackup = function(backup) {
    backup.detailsHtml = actBackup.prototype.processTemplate($("#glcLookupActBackupDetailsTpl").html(), backup);
    $("#glcLookupBackupDetails").html(backup.detailsHtml);

    actBackup.prototype.addButtonBindings(backup);

    var listItem = $("#glcLookupActBackupListItem" + backup.number);
    listItem.prop("checked", true);
}

actBackup.prototype.processTemplate = function(html, backup) {
    htmlAltered = html;
    htmlAltered = replaceAllInstances(htmlAltered, "{{loginName}}", backup.loginName);
    htmlAltered = replaceAllInstances(htmlAltered, "{{forcePwdChange}}", backup.forcePwdChange);
    htmlAltered = replaceAllInstances(htmlAltered, "{{allowPwdChange}}", backup.allowPwdChange);
    htmlAltered = replaceAllInstances(htmlAltered, "{{pwdNeverExpire}}", backup.pwdNeverExpire);
    htmlAltered = replaceAllInstances(htmlAltered, "{{role}}", backup.role);
    htmlAltered = replaceAllInstances(htmlAltered, "{{createDate}}", backup.createDate);
    htmlAltered = replaceAllInstances(htmlAltered, "{{lastLogon}}", backup.lastLogon);
    htmlAltered = replaceAllInstances(htmlAltered, "{{lastLogoff}}", backup.lastLogoff);
    htmlAltered = replaceAllInstances(htmlAltered, "{{contactName}}", backup.contactName);
    return htmlAltered;
}

actBackup.prototype.addButtonBindings = function(backup) {
    $("#glcBackupDetailsScreenSelection").on("click", "ul > li", function(e) {
        backup.screenSelectionPageId = $(e.target).attr("data-pageId");
        actBackup.prototype.setScreenSelectionPage(backup);
    })
}

actBackup.prototype.setScreenSelectionPage = function(backup) {
    if (backup.screenSelectionPageId) {
        changePage("glcBackupDetailsScreenSelection", backup.screenSelectionPageId);
        changeTab("glcBackupDetailsScreenSelection", backup.screenSelectionPageId);
    }
}