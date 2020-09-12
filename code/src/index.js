const db = require("./db")
const ALLOWED_MODES = ["real", "local", "recordActionsInDb"]
module.exports = (config) => {
    // REQUIRED SETUP
    if (!config.setup) {
        throw new Error("You must have config.setup defined")
    }

    let awsSail = {}

    /**
     * Mode:
     * real | local | recordActionsInDb
     *
     * real is good for actual deployed usage
     * local is good for local unit testing
     * recordActionsInDb is good for E2E testing
     * - https://medium.com/theburningmonk-com/how-to-include-sns-and-kinesis-in-your-e2e-tests-d73c6d80e874
     *
     */
    if (!ALLOWED_MODES.includes(config.setup.mode)) {
        throw new Error("mode is not supported")
    }
    const mode = config.setup.mode

    // OPTIONAL SETUP
    if (config.db) {
        const table = config.db.table
        const region = config.db.region

        awsSail.db = db({
            mode,
            region,
            table,
        })
    }

    if (config.cognito) {
        const userPool = config.cognito.userPool || false
        const userPoolClient = config.cognito.userPoolClient || false
    }

    if (config.eventBridge) {
        const eventBus = config.eventBridge.eventBus
    }

    if (config.sns) {
    }

    if (config.codeDeploy) {
        const endpoint = config.codeDelpoy.endpoint
    }

    return awsSail
}
