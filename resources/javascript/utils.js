function replaceAllInstances(text, replaceThis, withThis, callback) {
    while (text.indexOf(replaceThis) != -1)
    {
        text = text.replace(replaceThis, withThis);
    }
    callback(text);
}

/*
Handle a sequence of functions in series
@param Array<function> functionArray = list of functions to run
*/
function functionSeries(functionArray) {
    var deferred = new $.Deferred(),
    sequenceNum = 0;

    runFunction = function() {
        if (sequenceNum > functionArray.length) {
            deferred.resolve();
            return;
        }
        var func = functionArray[sequenceNum];
        $.when(func).always(function() {
            sequenceNum++;
            runFunction();
        });
    }

    runFunction();

    return deferred.promise();
}