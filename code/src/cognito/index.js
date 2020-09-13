const real = require("./mode/real")
const local = require("./mode/local")
const recordActionInDatabase = require("./mode/recordActionInDatabase")

module.exports = ({ mode, userPoolId, table, region }) => {
    if (mode === "real") {
        return real({
            userPoolId,
        })
    }

    if (mode === "recordActionsInDb") {
        return recordActionInDatabase({
            table,
            region,
        })
    }

    if (mode === "local") {
        return local()
    }
}
