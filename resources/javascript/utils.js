function replaceAllInstances(text, replaceThis, withThis) {
    while (text.indexOf(replaceThis) != -1)
    {
        text = text.replace(replaceThis, withThis);
    }
    return text;
}

// Email validation function shamelessly borrowed from https://stackoverflow.com/a/46181
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// function findString()
/*
Oh, you thought findString() would be here? In utils.js?
What nonsense.

For some reason it errored when it was in here, and I didn't have time to troubleshoot.
Something about needing to get Glacier Web finished before I left the company.
replaceAllInstances() works fine, so I dunno. Some magic or something.
Each function that needs findString() has it declared separately.

Good luck, Swiftie! You're going to need it.

~ Chris Manders
*/