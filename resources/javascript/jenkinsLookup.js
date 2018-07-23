var jenkinsLookupArray = [];
var lookupCount = 0;

function jenkinsLookup(rawLookupOutput) {
    var data = {};
    data.lookupNumber = lookupCount;
    lookupCount++;

    data.lookupCustomerBy = findString(rawLookupOutput, "[LookupCustomerBy=", "]").trim();
    data.lookupValue = findString(rawLookupOutput, "[LookupValue=", "]").trim();
    data.lookupResult = findString(rawLookupOutput, "[LookupResult=", "]").trim();

    if (data.lookupResult = "Located") {
        parseLookupData();
        addLookupListItem();
        jenkinsLookup.prototype.buildLookupResultsUI(data);
    };

    return data;

    function parseLookupData() {
        data.locatedIITID = findString(rawLookupOutput, "[LocatedIITID=", "]").trim();
        data.accountInfoFound = findString(rawLookupOutput, "[AccountInfoFound=", "]").trim();
        data.iitID = findString(rawLookupOutput, "[IITID=", "]").trim();
        data.zuoraAccount = findString(rawLookupOutput, "[ZuoraAccount=", "]").trim();
        data.clientID = findString(rawLookupOutput, "[ClientID=", "]").trim();
        data.accountName = findString(rawLookupOutput, "[AccountName=", "]").trim();
        data.product = findString(rawLookupOutput, "[Product=", "]").trim();
        data.locale = findString(rawLookupOutput, "[Locale=", "]").trim();
        data.email = findString(rawLookupOutput, "[Email=", "]").trim();
        data.createDate = findString(rawLookupOutput, "[CreateDate=", "]").trim();
        data.trialOrPaid = findString(rawLookupOutput, "[TrialOrPaid=", "]").trim();
        data.serialNumber = findString(rawLookupOutput, "[SerialNumber=", "]").trim();
        data.seatCount = findString(rawLookupOutput, "[SeatCount=", "]").trim();
        data.suspendStatus = findString(rawLookupOutput, "[SuspendStatus=", "]").trim();
        data.archiveStatus = findString(rawLookupOutput, "[ArchiveStatus=", "]").trim();
        data.deleteStatus = findString(rawLookupOutput, "[DeleteStatus=", "]").trim();
    
        data.siteInfoFound = findString(rawLookupOutput, "[SiteInfoFound=", "]").trim();
        data.siteInfoArray = findString(rawLookupOutput, "[SITEINFOSTART]", "[SITEINFOEND]").split("[SiteInfo=");
        data.siteInfo = [];
        for (var i = 0; i < data.siteInfoArray.length; i++) {
            if (data.siteInfoArray[i] == "\r\n" || data.siteInfoArray[i] == undefined) {continue};
            data.siteInfo.push(parseSiteInfo(data.siteInfoArray[i]));
        }

        data.databaseTextArray = findString(rawLookupOutput, "[DATABASEINFOSTART]", "[DATABASEINFOEND]").split("[Database=");
        data.databases = [];
        for (var i = 0; i < data.databaseTextArray.length; i++) {
            if (data.databaseTextArray[i] == "\r\n" || data.databaseTextArray[i] == undefined) {continue};
            var parsedDatabaseInfo = parseDatabaseInfo(data.databaseTextArray[i]);
            var database = new actDatabase(parsedDatabaseInfo)
            data.databases.push(database);
        }
    
        data.activityTextArray = findString(rawLookupOutput, "[PROVISIONINGINFOSTART]", "[PROVISIONINGINFOEND]").split("[Activity=");
        data.activity = [];
        for (var i = 0; i < data.activityTextArray.length; i++) {
            if (data.activityTextArray[i] == "\r\n" || data.activityTextArray[i] == undefined) {continue};
            data.activity.push(parseActivityInfo(data.activityTextArray[i]));
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
        data.siteName = findString(siteInfoText, "{SiteName=", "}").trim();
        data.iisServer = findString(siteInfoText, "{IISServer=", "}").trim();
        data.url = findString(siteInfoText, "{URL=", "}").trim();
        data.uploadUrl = findString(siteInfoText, "{UploadURL=", "}").trim();
        return data;
    }

    function parseDatabaseInfo(databaseInfoText) {
        var data = {};
        data.name = findString(databaseInfoText, "{Name=", "}").trim();
        data.server = findString(databaseInfoText, "{Server=", "}").trim();
        return data;
    }

    function parseActivityInfo(activityInfoText) {
        var data = {};
        data.date = findString(activityInfoText, "{Date=", "}").trim();
        data.type = findString(activityInfoText, "{Type=", "}").trim();
        data.status = findString(activityInfoText, "{Status=", "}").trim();
        data.detail = findString(activityInfoText, "{Detail=", "}").trim();
        if (data.detail == "NULL") {
            data.detail = "";
        }
        return data;
    }

    function addLookupListItem() {
        data.lookupListItemHtml = jenkinsLookup.prototype.processTemplate($("#glcLookupListItemTpl").html(), data);
        $("#glcMainUIAccountList").append(data.lookupListItemHtml);
        var listItem = $("#glcLookupsListItem" + data.lookupNumber);
        listItem.on("click", function() {
            jenkinsLookup.prototype.buildLookupResultsUI(data);
        })
    }
};

jenkinsLookup.prototype.newLookup = function(jenkinsServer, searchBy, searchFor) {
    jenkinsApi.prototype.lookupAccount(jenkinsServer.url, jenkinsServer.id, searchBy, searchFor, function(response) {
        handleResponse(response)
    })

    function handleResponse(response) {
        var lookup = new jenkinsLookup(response.data);
        jenkinsLookupArray.push(lookup);
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