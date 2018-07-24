function replaceAllInstances(text, replaceThis, withThis) {
    while (text.indexOf(replaceThis) != -1)
    {
        text = text.replace(replaceThis, withThis);
    }
    return text;
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