const aws = require("aws-sdk")
const cognito = new aws.CognitoIdentityServiceProvider({
    region: process.env.REGION,
})
const makePassword = require("../utils/makePassword")

module.exports = ({ userPoolId }) => ({
    /**
     * api reference:
     * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html
     *
     */
    createUser: async ({ email }) => {
        const password = makePassword()
        const params = {
            UserPoolId: userPoolId,
            Username: email,
            TemporaryPassword: password,
            MessageAction: "SUPPRESS",
            UserAttributes: [
                {
                    Name: "name",
                    Value: email,
                },
                {
                    Name: "email",
                    Value: email,
                },
                {
                    Name: "email_verified",
                    Value: "True",
                },
            ],
        }

        try {
            await cognito.adminCreateUser(params).promise()
            return {
                email,
                password,
            }
        } catch (err) {
            // any specif errors we should take of?
            throw new Error(err)
        }
    },

    deleteUser: async (email) => {
        const params = {
            UserPoolId: userPoolId,
            Username: email,
        }

        try {
            await cognito.adminDeleteUser(params).promise()
            return true
        } catch (err) {
            // any specif errors we should take of?
            throw new Error(err)
        }
    },

    hasUserUsedTemporaryPassword: async (email) => {
        const params = {
            UserPoolId: userPoolId,
            Username: email,
        }

        const x = await cognito.adminGetUser(params).promise()

        return x.UserStatus !== "FORCE_CHANGE_PASSWORD"
    },
})
