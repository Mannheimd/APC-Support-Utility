var jenkinsLookupArray = [];
var lookupCount = 0;

function jenkinsLookup(rawLookupOutput, jenkinsServer) {
    var data = {};
    data.jenkinsServer = jenkinsServer;
    data.lookupNumber = lookupCount;
    lookupCount++;

    data.lookupCustomerBy = findString(rawLookupOutput, "[LookupCustomerBy=", "]");
    data.lookupValue = findString(rawLookupOutput, "[LookupValue=", "]");
    data.lookupResult = findString(rawLookupOutput, "[LookupResult=", "]");

    if (data.lookupResult == "Located") {
        parseLookupData();
    };

    return data;

    function parseLookupData() {
        data.locatedIITID = findString(rawLookupOutput, "[LocatedIITID=", "]");
        data.accountInfoFound = findString(rawLookupOutput, "[AccountInfoFound=", "]");
        data.iitID = findString(rawLookupOutput, "[IITID=", "]");
        data.zuoraAccount = findString(rawLookupOutput, "[ZuoraAccount=", "]");
        data.clientID = findString(rawLookupOutput, "[ClientID=", "]");
        data.accountName = findString(rawLookupOutput, "[AccountName=", "]");
        data.product = findString(rawLookupOutput, "[Product=", "]");
        data.locale = findString(rawLookupOutput, "[Locale=", "]");
        data.email = findString(rawLookupOutput, "[Email=", "]");
        data.createDate = findString(rawLookupOutput, "[CreateDate=", "]");
        data.trialOrPaid = findString(rawLookupOutput, "[TrialOrPaid=", "]");
        data.serialNumber = findString(rawLookupOutput, "[SerialNumber=", "]");
        data.seatCount = findString(rawLookupOutput, "[SeatCount=", "]");
        data.suspendStatus = findString(rawLookupOutput, "[SuspendStatus=", "]");
        data.archiveStatus = findString(rawLookupOutput, "[ArchiveStatus=", "]");
        data.deleteStatus = findString(rawLookupOutput, "[DeleteStatus=", "]");
    
        var siteInfoText = findString(rawLookupOutput, "[SITEINFOSTART]", "[SITEINFOEND]");
        if (siteInfoText != undefined) {
            data.siteTextArray = siteInfoText.split("[SiteInfo=");
            data.siteInfo = [];
            for (var i = 0; i < data.siteTextArray.length; i++) {
                if (data.siteTextArray[i] == "\r\n" || data.siteTextArray[i] == undefined) {continue};
                data.siteInfo.push(parseSiteInfo(data.siteTextArray[i]));
            }
        }

        var databaseText = findString(rawLookupOutput, "[DATABASEINFOSTART]", "[DATABASEINFOEND]");
        if (databaseText != undefined) {
            data.databaseTextArray = databaseText.split("[Database=");
            data.databases = [];
            for (var i = 0; i < data.databaseTextArray.length; i++) {
                if (data.databaseTextArray[i] == "\r\n" || data.databaseTextArray[i] == undefined) {continue};
                var parsedDatabaseInfo = parseDatabaseInfo(data.databaseTextArray[i]);
                var database = new actDatabase(parsedDatabaseInfo)
                database.jenkinsServer = jenkinsServer;
                data.databases.push(database);
            }
        }
    
        var activityText = findString(rawLookupOutput, "[PROVISIONINGINFOSTART]", "[PROVISIONINGINFOEND]");
        if (activityText != undefined) {
            data.activityTextArray = activityText.split("[Activity=");
            data.activity = [];
            for (var i = 0; i < data.activityTextArray.length; i++) {
                if (data.activityTextArray[i] == "\r\n" || data.activityTextArray[i] == undefined) {continue};
                data.activity.push(parseActivityInfo(data.activityTextArray[i]));
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

    function parseSiteInfo(siteInfoText) {
        var data = {};
        data.siteName = findString(siteInfoText, "{SiteName=", "}");
        data.iisServer = findString(siteInfoText, "{IISServer=", "}");
        data.url = findString(siteInfoText, "{URL=", "}");
        data.uploadUrl = findString(siteInfoText, "{UploadURL=", "}");
        return data;
    }

    function parseDatabaseInfo(databaseInfoText) {
        var data = {};
        data.name = findString(databaseInfoText, "{Name=", "}");
        data.server = findString(databaseInfoText, "{Server=", "}");
        return data;
    }

    function parseActivityInfo(activityInfoText) {
        var data = {};
        data.date = findString(activityInfoText, "{Date=", "}");
        data.type = findString(activityInfoText, "{Type=", "}");
        data.status = findString(activityInfoText, "{Status=", "}");
        data.detail = findString(activityInfoText, "{Detail=", "}");
        if (data.detail == "NULL") {
            data.detail = "";
        }
        return data;
    }
};

jenkinsLookup.prototype.newLookup = function(jenkinsServer, searchBy, searchFor) {
    alterUI(true, "Searching...");

    jenkinsApi.prototype.lookupAccount(jenkinsServer.url, jenkinsServer.id, searchBy, searchFor, function(response) {
        handleResponse(response)
    })

    function handleResponse(response) {
        var lookup = new jenkinsLookup(response.data, jenkinsServer);
        if (lookup.lookupResult == "Located") {
            jenkinsLookup.prototype.addLookupListItem(lookup);
            jenkinsLookup.prototype.buildLookupResultsUI(lookup);
            jenkinsLookupArray.push(lookup);
            alterUI(false);
        } else if (lookup.lookupResult == "NotFound") {
            alterUI(false, "Account not found");
        } else {
            alterUI(false, "Lookup failed");
        }
    }

    function alterUI(disabled, message) {
        if (disabled) {
            $("#glcMainUINewLookupForm input").prop("disabled", true);
        } else {
            $("#glcMainUINewLookupForm input").prop("disabled", false);
        }

        if (message) {
            $("#glcMainUINewLookupStatus").html(message);
        } else {
            $("#glcMainUINewLookupStatus").html("");
        }
    }
}

jenkinsLookup.prototype.processTemplate = function(html, lookup) {
    htmlAltered = html;
    htmlAltered = replaceAllInstances(htmlAltered, "{{lookupNumber}}", lookup.lookupNumber);
    htmlAltered = replaceAllInstances(htmlAltered, "{{accountName}}", lookup.accountName);
    htmlAltered = replaceAllInstances(htmlAltered, "{{zuoraAccount}}", lookup.zuoraAccount);
    htmlAltered = replaceAllInstances(htmlAltered, "{{product}}", lookup.product);
    htmlAltered = replaceAllInstances(htmlAltered, "{{email}}", lookup.email);
    htmlAltered = replaceAllInstances(htmlAltered, "{{locale}}", lookup.locale);
    htmlAltered = replaceAllInstances(htmlAltered, "{{loginUrl}}", lookup.siteInfo[0].url);
    htmlAltered = replaceAllInstances(htmlAltered, "{{uploadUrl}}", lookup.siteInfo[0].uploadUrl);
    htmlAltered = replaceAllInstances(htmlAltered, "{{iisServer}}", lookup.siteInfo[0].iisServer);
    htmlAltered = replaceAllInstances(htmlAltered, "{{iitID}}", lookup.iitID);
    htmlAltered = replaceAllInstances(htmlAltered, "{{createDate}}", lookup.createDate);
    htmlAltered = replaceAllInstances(htmlAltered, "{{trialOrPaid}}", lookup.trialOrPaid);
    htmlAltered = replaceAllInstances(htmlAltered, "{{serialNumber}}", lookup.serialNumber);
    htmlAltered = replaceAllInstances(htmlAltered, "{{seatCount}}", lookup.seatCount);
    htmlAltered = replaceAllInstances(htmlAltered, "{{accountStatus}}", determineAccountStatus);
    return htmlAltered;

    function determineAccountStatus() {
        if (lookup.deleteStatus == "Deleted") {return "Deleted"}
        else if (lookup.archiveStatus == "Archived") {return "Archived"}
        else if (lookup.suspendStatus == "Suspended") {return "Suspended"}
        else {return "Active"}
    }
}

jenkinsLookup.prototype.getLookupByLookupNumber = function(lookupNumber) {
    return jenkinsServerArray.filter(function(obj) {
        return (obj.lookupNumber == lookupNumber);
        // Counter-intuitive, returns an array of results
        // Should only ever be one correct result as lookupNumber is unique
        // jenkinsLookup.prototype.getLookupByLookupNumber(id)[0] is the suggested use.
    })
}

jenkinsLookup.prototype.addLookupListItem = function(lookup) {
    lookup.lookupListItemHtml = jenkinsLookup.prototype.processTemplate($("#glcLookupListItemTpl").html(), lookup);
    $("#glcMainUIAccountList").append(lookup.lookupListItemHtml);
    var listItem = $("#glcLookupsListItem" + lookup.lookupNumber);
    listItem.on("click", function() {
        jenkinsLookup.prototype.buildLookupResultsUI(lookup);
    })
}

jenkinsLookup.prototype.buildLookupResultsUI = function(lookup) {
    html = jenkinsLookup.prototype.processTemplate($("#glcLookupResultTpl").html(), lookup);
    $("#glcMainUIDisplayPageDetails").html(html);
    changePage("glcMainUIDisplayPage", "glcMainUIDisplayPageDetails");

    jenkinsLookup.prototype.setScreenSelectionPage(lookup);
    jenkinsLookup.prototype.addButtonBindings(lookup);
    selectThisLookupListItem();

    addDatabases();
    addActivity();

    function selectThisLookupListItem() {
        $("input[name=glcMainUIAccountList]:radio").each(function() {
            if ($(this).attr('id') == "glcLookupsListItem" + lookup.lookupNumber) {
                $(this).prop("checked", true);
            } else {
                $(this).prop("checked", false);
            }
        })
    }

    function addDatabases() {
        if (lookup.databases) {
            var databaseList = $("#glcLookupDatabaseList");
            for (var i = 0; i < lookup.databases.length; i++) {
                actDatabase.prototype.addDatabaseListItem(lookup.databases[i], databaseList, lookup);
            }

            databaseList.on("change", function(e) {
                databaseId = databaseList.val();
                database = actDatabase.prototype.getDatabaseById(lookup.databases, databaseId)[0];
                if (database) {
                    actDatabase.prototype.switchToDatabase(database);
                }
            })

            if (lookup.selectedDatabase) {
                actDatabase.prototype.switchToDatabase(lookup.selectedDatabase);
            }
        }
    }

    function addActivity() {
        for (var i = 0; i < lookup.activity.length; i++) {
            $("#glcLookupActivityTable > tbody").append("<tr><td>" + lookup.activity[i].date + "</td><td>" + lookup.activity[i].type + "</td><td>" + lookup.activity[i].detail + "</td></tr>")
        }
    }
}

jenkinsLookup.prototype.addButtonBindings = function(lookup) {
    $("#glcLookupResultScreenSelection").on("click", "ul > li", function(e) {
        lookup.screenSelectionPageId = $(e.target).attr("data-pageId");
        jenkinsLookup.prototype.setScreenSelectionPage(lookup);
    })
}

jenkinsLookup.prototype.setScreenSelectionPage = function(lookup) {
    if (lookup.screenSelectionPageId) {
        changePage("glcLookupResultScreenSelection", lookup.screenSelectionPageId);
        changeTab("glcLookupResultScreenSelection", lookup.screenSelectionPageId);
    }
}

jenkinsLookup.prototype.setSelectedDatabase = function(lookup, database) {
    lookup.selectedDatabase = database;
}