var jenkinsLookupArray = [];

function jenkinsLookup(rawLookupOutput) {
    var data = {};
    data.lookupCustomerBy = findString(rawLookupOutput, "[LookupCustomerBy=", "]").trim();
    data.lookupValue = findString(rawLookupOutput, "[LookupValue=", "]").trim();
    data.lookupResult = findString(rawLookupOutput, "[LookupResult=", "]").trim();
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
        if (data.siteInfoArray[i] == "\r\n") {continue};
        data.siteInfo.push(parseSiteInfo(data.siteInfoArray[i]));
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