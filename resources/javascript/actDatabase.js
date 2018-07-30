var databaseCount = 0;

function actDatabase(databaseInfo) {
    data = databaseInfo;
    data.number = databaseCount;
    databaseCount++;

    return data;
}

actDatabase.prototype.addDatabaseListItem = function(database, targetList, lookup) {
    database.listItemHtml = actDatabase.prototype.processTemplate($("#glcLookupActDatabaseListItemTpl").html(), database);
    $(targetList).append(database.listItemHtml);
}

actDatabase.prototype.switchToDatabase = function(database) {
    database.detailsHtml = actDatabase.prototype.processTemplate($("#glcLookupActDatabaseDetailsTpl").html(), database);
    $("#glcLookupDatabaseDetails").html(database.detailsHtml);

    actDatabase.prototype.addButtonBindings(database);
    addExpandoButtonFunction($("#glcLookupDatabaseDetails"));

    var listItem = $("#glcLookupActDatabaseListItem" + database.number);
    listItem.prop("checked", true);

    actDatabase.prototype.getUsers(database);
}

actDatabase.prototype.processTemplate = function(html, database) {
    htmlAltered = html;
    htmlAltered = replaceAllInstances(htmlAltered, "{{databaseNumber}}", database.number);
    htmlAltered = replaceAllInstances(htmlAltered, "{{databaseName}}", database.name);
    htmlAltered = replaceAllInstances(htmlAltered, "{{databaseServer}}", database.server);
    return htmlAltered;
}

actDatabase.prototype.addButtonBindings = function(database) {
    $("#glcDatabaseDetailsScreenSelection").on("click", "ul > li", function(e) {
        database.screenSelectionPageId = $(e.target).attr("data-pageId");
        actDatabase.prototype.setScreenSelectionPage(database);
    })
        
    $("#glcLookupUnlockDatabaseForm").on("submit", function(e) {
        var params = $("#" + e.target.id).serializeArray();

        // params left in for future compatibility, but not needed here
        if (checkFormFieldsComplete(params, 0)) {
            actDatabase.prototype.unlockDatabase(database);
        }

        e.preventDefault();
    })
}

actDatabase.prototype.setScreenSelectionPage = function(database) {
    if (database.screenSelectionPageId) {
        changePage("glcDatabaseDetailsScreenSelection", database.screenSelectionPageId);
        changeTab("glcDatabaseDetailsScreenSelection", database.screenSelectionPageId);
    }
}

actDatabase.prototype.getUsers = function(database) {
    database.users = [];
    alterUI(false, "Getting users...");
    
    jenkinsApi.prototype.getDatabaseUsers(database.jenkinsServer.url, database.jenkinsServer.id, database.name, database.server, function(response) {
        if (response.status = "success") {
            if (findString(response.data, "[UserInfoFound=", "]") == "true") {
                handleNewUser(response);
                alterUI(true);
            } else {
                alterUI(false, "No user info found.");
            }
        } else {
            alterUI(false, "User lookup failed.");
        }
    })

    function handleNewUser(response) {
        var usersText = findString(response.data, "[STARTDATA]", "[ENDDATA]");
        var usersTextSplit = usersText.split("[User=");
        for (var i = 1; i < usersTextSplit.length; i++) {
            var user = new actUser(usersTextSplit[i]);
            database.users.push(user);

            var userList = $("#glcLookupUserList");
            actUser.prototype.addUserListItem(user, userList, database);
        }
    }

    function alterUI(haveUsers, message) {
        var giveUsersPlz = $("#glcLookupActUserDetailsGetting");
        var helloYesIHaveUsersWhatDo = $("#glcLookupActUserDetailsFound");
        var justALonelyH3OnTheLonelyRoad = $("#glcLookupActUserDetailsGettingStatus");
    
        if (haveUsers) {
            hide(giveUsersPlz);
            show(helloYesIHaveUsersWhatDo);
        } else {
            hide(helloYesIHaveUsersWhatDo);
            show(giveUsersPlz);
        }

        if (message) {
            justALonelyH3OnTheLonelyRoad.html(message);
        } else {
            justALonelyH3OnTheLonelyRoad.html("");
        }

        function show(id) {
            id.removeClass("hidden");
        }

        function hide(id) {
            if (!id.hasClass("hidden")) {
                id.addClass("hidden");
            }
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

actDatabase.prototype.getDatabaseById = function(databaseArray, databaseId) {
    return databaseArray.filter(function(obj) {
        return (obj.number == databaseId);
        // Counter-intuitive, returns an array of results not a single result
        // Should only ever be one correct result as ID is unique
        // Suggested use: ...getDatabaseById(databaseArray, databaseId)[0]
        // Will return undefined if it can't find a result.
    })
}

actDatabase.prototype.unlockDatabase = function(database) {
    alterUI(true, "Unlocking...");

    jenkinsApi.prototype.unlockDatabase(database.jenkinsServer.url, database.jenkinsServer.id, database.server, database.name, function(response) {
        handleResponse(response);
    })

    function handleResponse(response) {
        if (response.status == "success"
        && response.data.indexOf("Invalid") === -1) {
            alterUI(false, "Database unlocked");
        } else {
            alterUI(false, "Database unlock failed");
        }
    }

    function alterUI(disabled, message) {
        if (disabled) {
            $("#glcLookupUnlockDatabaseForm input").prop("disabled", true);
        } else {
            $("#glcLookupUnlockDatabaseForm input").prop("disabled", false);
        }

        if (message) {
            $("#glcLookupUnlockDatabaseStatus").html(message);
        } else {
            $("#glcLookupUnlockDatabaseStatus").html("");
        }
    }
}

actDatabase.prototype.getBackups = function(database) {
    database.backups = [];
    alterUI(false, "Getting backups...");
    
    jenkinsApi.prototype.getDatabaseBackups(database.jenkinsServer.url, database.jenkinsServer.id, database.name, database.server, function(response) {
        if (response.status = "success") {
            if (findString(response.data, "[BackupInfoFound=", "]") == "true") {
                handleNewBackups(response);
                alterUI(true);
            } else {
                alterUI(false, "No backup info found.");
            }
        } else {
            alterUI(false, "Backup load failed.");
        }
    })

    function handleNewBackups(response) {
        var backupsText = findString(response.data, "[STARTDATA]", "[ENDDATA]");
        var backupsTextSplit = backupsText.split("[Backup=");
        var currentFullBackup = {};
        for (var i = 1; i < backupsTextSplit.length; i++) {
            var backup = new actBackup(backupsTextSplit[i]);

            // Backup is only counted as valid if it is a full, or has an older full backup
            // Assumes backups are returned in date order
            if (backup.type == "full") {
                currentFullBackup = backup;
                database.backups.push(backup);
            } else if (backup.type == "diff" && currentFullBackup) {
                backup.full = currentFullBackup;
                database.backups.push(backup);
            }

            var backupList = $("#glcLookupBackupList");
            actBackup.prototype.addBackupListItem(backup, backupList, database);
        }
    }

    function alterUI(haveBackups, message) {
        var giveBackupsPlz = $("#glcLookupActBackupDetailsGetting");
        var helloYesIHaveBackupsWhatDo = $("#glcLookupActBackupDetailsFound");
        var justALonelyH3OnTheLonelyRoad = $("#glcLookupActBackupDetailsGettingStatus");
    
        if (haveBackups) {
            hide(giveBackupsPlz);
            show(helloYesIHaveBackupsWhatDo);
        } else {
            hide(helloYesIHaveBackupsWhatDo);
            show(giveBackupsPlz);
        }

        if (message) {
            justALonelyH3OnTheLonelyRoad.html(message);
        } else {
            justALonelyH3OnTheLonelyRoad.html("");
        }

        function show(id) {
            id.removeClass("hidden");
        }

        function hide(id) {
            if (!id.hasClass("hidden")) {
                id.addClass("hidden");
            }
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

actDatabase.prototype.setSelectedUser = function(database, user) {
    database.selectedUser = user;
}

actDatabase.prototype.setSelectedBackup = function(database, backup) {
    database.selectedBackup = backup;
}