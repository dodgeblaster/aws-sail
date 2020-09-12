const real = require("./modes/real")
const local = require("./modes/local")

module.exports = ({ mode, table, region }) => {
    if (mode === "real") {
        return real({ table, region })
    }

    if (mode === "recordActionsInDb") {
        return real({ table, region })
    }

    if (mode === "local") {
        return local()
    }
}
