const db = require("./db")
const cognito = require("./cognito")
const hook = require("./codeDeploy")

const ALLOWED_MODES = ["real", "local", "recordActionsInDb"]

const httpTryCatch = (fn) => async (e) => {
    try {
        const res = await fn(e)

        return {
            statusCode: 200,
            body: JSON.stringify(res),
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ mesage: e.message }),
        }
    }
}

module.exports = (config) => {
    // REQUIRED SETUP
    if (!config.setup) {
        throw new Error("You must have config.setup defined")
    }

    let awsSail = {
        httpTryCatch,
    }

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

    if (config.cognito && config.db) {
        const userPoolId = config.cognito.userPool || false
        const table = config.db.table
        const region = config.db.region

        awsSail.cognito = cognito({
            mode,
            userPoolId,
            table,
            region,
        })
    }

    // if (config.eventBridge) {
    //     const eventBus = config.eventBridge.eventBus
    // }

    // if (config.sns) {
    // }

    if (config.codeDeploy) {
        const table = config.db.table
        const region = config.db.region
        const endpoint = config.codeDeploy.endpoint
        awsSail.hook = hook({ endpoint, table, region })
    }

    return awsSail
}
