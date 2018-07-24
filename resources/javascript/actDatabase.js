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
    var listItem = $("#glcLookupActDatabaseListItem" + database.number);
    listItem.on("click", function() {
        jenkinsLookup.prototype.setSelectedDatabase(lookup, database);
        actDatabase.prototype.switchToDatabase(database);
    })
}

actDatabase.prototype.switchToDatabase = function(database) {
    database.detailsHtml = actDatabase.prototype.processTemplate($("#glcLookupActDatabaseDetailsTpl").html(), database);
    $("#glcLookupDatabaseDetails").html(database.detailsHtml);

    actDatabase.prototype.addButtonBindings(database);

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
        for (var i = 0; i < usersTextSplit.length; i++) {
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