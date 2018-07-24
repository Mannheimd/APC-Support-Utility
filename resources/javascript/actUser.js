var userCount = 0;

function actUser(userInfo) {
    data = userInfo;
    data.number = userCount;
    userCount++;

    return data;
}

actUser.prototype.addUserListItem = function(user, targetList, lookup) {
    user.listItemHtml = actUser.prototype.processTemplate($("#glcLookupActUserListItemTpl").html(), user);
    $(targetList).append(user.listItemHtml);
    var listItem = $("#glcLookupActUserListItem" + user.number);
    listItem.on("click", function() {
        jenkinsLookup.prototype.setSelectedUser(lookup, user);
        actUser.prototype.switchToUser(user);
    })
}

actUser.prototype.switchToUser = function(user) {
    user.detailsHtml = actUser.prototype.processTemplate($("#glcLookupActUserDetailsTpl").html(), user);
    $("#glcLookupUserDetails").html(user.detailsHtml);

    actUser.prototype.addButtonBindings(user);

    var listItem = $("#glcLookupActUserListItem" + user.number);
    listItem.prop("checked", true);
}

actUser.prototype.processTemplate = function(html, user) {
    htmlAltered = html;
    htmlAltered = replaceAllInstances(htmlAltered, "{{userNumber}}", user.number);
    htmlAltered = replaceAllInstances(htmlAltered, "{{userName}}", user.name);
    htmlAltered = replaceAllInstances(htmlAltered, "{{userServer}}", user.server);
    return htmlAltered;
}

actUser.prototype.addButtonBindings = function(user) {
    $("#glcUserDetailsScreenSelection").on("click", "ul > li", function(e) {
        user.screenSelectionPageId = $(e.target).attr("data-pageId");
        actUser.prototype.setScreenSelectionPage(user);
    })
}

actUser.prototype.setScreenSelectionPage = function(user) {
    if (user.screenSelectionPageId) {
        changePage("glcUserDetailsScreenSelection", user.screenSelectionPageId);
        changeTab("glcUserDetailsScreenSelection", user.screenSelectionPageId);
    }
}