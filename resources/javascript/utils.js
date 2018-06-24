function replaceAllInstances(text, replaceThis, withThis, callback) {
    while (text.indexOf(replaceThis) != -1)
    {
        text = text.replace(replaceThis, withThis);
    }
    callback(text);
}