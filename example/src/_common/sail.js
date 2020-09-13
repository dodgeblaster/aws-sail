const awssail = require("aws-sail")

const { db, hook, http } = awssail({
    setup: {
        mode: "real",
    },
    db: {
        table: process.env.TABLE,
        region: process.env.REGION,
    },
    codeDeploy: {
        endpoint: process.env.ENDPOINT,
    },
})

module.exports = {
    db,
    hook,
    http,
}
