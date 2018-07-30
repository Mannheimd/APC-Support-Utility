var userCount = 0;

function actUser(userText, database) {
    user = {};
    user.number = userCount;
    userCount++;

    user.database = database;

    parseUserText();

    return user;

    function parseUserText() {
        user.loginName = findString(userText, "{userlogin=", "}");
        user.isVerified = findString(userText, "{isverified=", "}");
        user.utcOffset = findString(userText, "{utc_offset=", "}");

        var forcePwdChangeText = findString(userText, "{isforcepwdchg=", "}");
        if (forcePwdChangeText = "1") {
            user.forcePwdChange = true;
        } else {
            user.forcePwdChange = false;
        }

        var allowPwdChangeText = findString(userText, "{isallowpwdchg=", "}");
        if (allowPwdChangeText = "1") {
            user.allowPwdChange = true;
        } else {
            user.allowPwdChange = false;
        }

        var pwdNeverExpireText = findString(userText, "{ispwdneverexpire=", "}");
        if (pwdNeverExpireText = "1") {
            user.pwdNeverExpire = true;
        } else {
            user.pwdNeverExpire = false;
        }

        user.role = findString(userText, "{displayname=", "}");

        var createDateText = findString(userText, "{createdate=", "}");
        user.createDate = Date.parseString(createDateText.substring(0, 20), "yyyy-MM-dd HH:mm:ss");

        var logonDateText = findString(userText, "{logondate=", "}");
        user.lastLogon = Date.parseString(logonDateText.substring(0, 20), "yyyy-MM-dd HH:mm:ss");

        var logoffDateText = findString(userText, "{logoffdate=", "}");
        user.lastLogoff = Date.parseString(logoffDateText.substring(0, 20), "yyyy-MM-dd HH:mm:ss");

        user.contactName = findString(userText, "{fullname=", "}");
    }

    function findString(text, startString, endString) {
        if (text == undefined) {return undefined};
        text = text.split(startString)[1];
        if (text == undefined) {return undefined};
        text = text.split(endString)[0];
        return text;
    }
}

actUser.prototype.addUserListItem = function(user, targetList, database) {
    user.listItemHtml = actUser.prototype.processTemplate($("#glcLookupActUserListItemTpl").html(), user);
    $(targetList).append(user.listItemHtml);
    var listItem = $("#glcLookupActUserListItem" + user.number);
    listItem.on("click", function() {
        actDatabase.prototype.setSelectedUser(database, user);
        actUser.prototype.switchToUser(user);
    })
}

actUser.prototype.switchToUser = function(user) {
    user.detailsHtml = actUser.prototype.processTemplate($("#glcLookupActUserDetailsTpl").html(), user);
    $("#glcLookupUserDetails").html(user.detailsHtml);

    actUser.prototype.addButtonBindings(user);
    addExpandoButtonFunction($("#glcLookupActUserDetailsFound"));

    var listItem = $("#glcLookupActUserListItem" + user.number);
    listItem.prop("checked", true);
}

actUser.prototype.processTemplate = function(html, user) {
    htmlAltered = html;
    htmlAltered = replaceAllInstances(htmlAltered, "{{userNumber}}", user.number);
    htmlAltered = replaceAllInstances(htmlAltered, "{{loginName}}", user.loginName);
    htmlAltered = replaceAllInstances(htmlAltered, "{{forcePwdChange}}", user.forcePwdChange);
    htmlAltered = replaceAllInstances(htmlAltered, "{{allowPwdChange}}", user.allowPwdChange);
    htmlAltered = replaceAllInstances(htmlAltered, "{{pwdNeverExpire}}", user.pwdNeverExpire);
    htmlAltered = replaceAllInstances(htmlAltered, "{{role}}", user.role);
    htmlAltered = replaceAllInstances(htmlAltered, "{{createDate}}", user.createDate);
    htmlAltered = replaceAllInstances(htmlAltered, "{{lastLogon}}", user.lastLogon);
    htmlAltered = replaceAllInstances(htmlAltered, "{{lastLogoff}}", user.lastLogoff);
    htmlAltered = replaceAllInstances(htmlAltered, "{{contactName}}", user.contactName);
    return htmlAltered;
}

actUser.prototype.addButtonBindings = function(user) {
    $("#glcUserDetailsScreenSelection").on("click", "ul > li", function(e) {
        user.screenSelectionPageId = $(e.target).attr("data-pageId");
        actUser.prototype.setScreenSelectionPage(user);
    })
        
    $("#glcLookupResetPasswordForm").on("submit", function(e) {
        var params = $("#" + e.target.id).serializeArray();

        // params left in for future compatibility, but not needed here
        if (checkFormFieldsComplete(params, 0)) {
            actUser.prototype.resetPassword(user);
        }

        e.preventDefault();
    })
}

actUser.prototype.setScreenSelectionPage = function(user) {
    if (user.screenSelectionPageId) {
        changePage("glcUserDetailsScreenSelection", user.screenSelectionPageId);
        changeTab("glcUserDetailsScreenSelection", user.screenSelectionPageId);
    }
}

actUser.prototype.resetPassword = function(user) {
    alterUI(true, "Resetting...");

    jenkinsApi.prototype.resetPassword(user.database.jenkinsServer.url, user.database.jenkinsServer.id, user.database.server, user.database.name, user.loginName, function(response) {
        handleResponse(response);
    })

    function handleResponse(response) {
        if (response.status == "success") {
            if (response.data.indexOf("****************** ERROR! ******************") !== -1) { // Jees Lunceford, got enough starts there?
                alterUI(false, "Password reset failed");
                return;
            }
            var jsonString = findString(response.data, "[STARTDATA]", "[ENDDATA]");
            var json = JSON.parse(jsonString);
            if (json.User_Login == user.loginName) {
            alterUI(false, "New password: " + json.New_Password);
            } else {
                "Error: Build returned wrong username - please notify cloudops@swiftpage.com immediately"
            }
        } else {
            alterUI(false, "Password reset failed");
        }
    }

    function findString(text, startString, endString) {
        if (text == undefined) {return undefined};
        text = text.split(startString)[1];
        if (text == undefined) {return undefined};
        text = text.split(endString)[0];
        return text;
    }

    function alterUI(disabled, message) {
        if (disabled) {
            $("#glcLookupResetPasswordForm input").prop("disabled", true);
        } else {
            $("#glcLookupResetPasswordForm input").prop("disabled", false);
        }

        if (message) {
            $("#glcLookupResetPasswordStatus").html(message);
        } else {
            $("#glcLookupResetPasswordStatus").html("");
        }
    }
}