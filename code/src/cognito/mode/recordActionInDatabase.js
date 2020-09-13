const makePassword = require("../utils/makePassword")
const setupDb = require("../../db/modes/real")

const e2ePk = "MOCKED_COGNITO_EVENT"

module.exports = ({ table, region }) => {
    const db = setupDb({ table, region })

    return {
        createUser: async ({ email }) => {
            await db.create({
                PK: e2ePk,
                SK: "createUser_@id",
                input: { email },
            })

            return {
                email,
                password: makePassword(),
            }
        },

        deleteUser: async (email) => {
            await db.create({
                PK: e2ePk,
                SK: "deleteUser_@id",
                input: { email },
            })

            return true
        },

        hasUserUsedTemporaryPassword: async (email) => {
            await db.create({
                PK: e2ePk,
                SK: "hasUserUsedTemporaryPassword_@id",
                input: { email },
            })

            return true
        },
    }
}
