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
    var listItem = $("#glcLookupActDatabaseListItem" + database.number);
    listItem.prop("checked", true);
}

actDatabase.prototype.processTemplate = function(html, database) {
    htmlAltered = html;
    htmlAltered = replaceAllInstances(htmlAltered, "{{databaseNumber}}", database.number);
    htmlAltered = replaceAllInstances(htmlAltered, "{{databaseName}}", database.name);
    htmlAltered = replaceAllInstances(htmlAltered, "{{databaseServer}}", database.server);
    return htmlAltered;
}