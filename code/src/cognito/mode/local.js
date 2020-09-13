const makePassword = require("../utils/makePassword")

module.exports = () => ({
    /**
     * api reference:
     * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html
     *
     */
    createUser: async ({ email }) => {
        return {
            email,
            password: makePassword(),
        }
    },

    deleteUser: async (email) => {
        return true
    },

    hasUserUsedTemporaryPassword: async (email) => {
        return true
    },
})
