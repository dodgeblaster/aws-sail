const AWS = require("aws-sdk")
const formatCreateItem = require("../utils/formatKeys")

/**
 * In a Lambda context, it is nice to initialize this function
 * outside of a handler function, so it stays cached on the next
 * execution.
 *
 */
module.exports = ({ table, region }) => {
    const db = new AWS.DynamoDB.DocumentClient({
        region: region,
    })

    const get = async (input) => {
        if (!input.SK) {
            throw new Error("Input must have SK defined")
        }

        if (input.PK) {
            const item = await db
                .get({
                    TableName: table,
                    Key: {
                        PK: input.PK,
                        SK: input.SK,
                    },
                })
                .promise()

            return item.Item || false
        }

        if (input.GSI1) {
            const item = await db
                .get({
                    TableName: table,
                    Key: {
                        GSI1: input.GSI1,
                        SK: input.SK,
                    },
                })
                .promise()

            return item.Item || false
        }
        if (input.GSI2) {
            const item = await db
                .get({
                    TableName: table,
                    Key: {
                        GSI2: input.GSI2,
                        SK: input.SK,
                    },
                })
                .promise()

            return item.Item || false
        }

        throw new Error("Input must have PK, GSI1, or GSI2 defined")
    }

    const query = async (input) => {
        if (!input.SK) {
            throw new Error("Input must have SK defined")
        }

        if (!input.PK && !input.GSI1 && !input.GSI2) {
            throw new Error("Input must have either PK, GSI1, or GSI2 defined")
        }

        let params = {}

        if (input.PK) {
            params = {
                TableName: table,
                KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
                ExpressionAttributeValues: {
                    ":pk": input.PK,
                    ":sk": input.SK,
                },
            }
        }

        if (input.GSI1) {
            params = {
                TableName: table,
                IndexName: "GSI1",
                KeyConditionExpression: "GSI1 = :gsi AND begins_with(SK, :sk)",
                ExpressionAttributeValues: {
                    ":gsi": input.GSI1,
                    ":sk": input.SK,
                },
            }
        }

        if (input.GSI2) {
            params = {
                TableName: table,
                IndexName: "GSI2",
                KeyConditionExpression: "GSI2 = :gsi AND begins_with(SK, :sk)",
                ExpressionAttributeValues: {
                    ":gsi": input.GSI2,
                    ":sk": input.SK,
                },
            }
        }

        const result = await db.query(params).promise()
        return result.Items || []
    }

    // TODO: create condition when using unique id
    // to only write if there is no existing item with same id
    const create = async (input) => {
        if (!input.PK && !input.GSI1 && !input.GSI2) {
            throw new Error("create must have either PK, GSI1, or GSI2 defined")
        }

        if (!input.SK) {
            throw new Error("create must have a SK defined")
        }

        const createItem = async () => {
            const formattedInput = formatCreateItem(input)

            await db
                .put({
                    TableName: table,
                    Item: formattedInput,
                    ConditionExpression: "attribute_not_exists(SK)",
                })
                .promise()

            return formattedInput
        }

        try {
            return await createItem()
        } catch (e) {
            if (
                e.message.includes("ConditionalCheckFailedException") &&
                input.SK.includes("@id")
            ) {
                // could retry multiple times, but once might be enough
                return await createItem()
            }
            throw new Error(e)
        }
    }

    const set = async (input) => {
        if (!input.PK && !input.GSI1 && !input.GSI2) {
            throw new Error("create must have either PK, GSI1, or GSI2 defined")
        }

        if (!input.SK) {
            throw new Error("create must have a SK defined")
        }

        await db
            .put({
                TableName: table,
                Item: input,
            })
            .promise()

        return input
    }

    const remove = async (input) => {
        await db
            .delete({
                TableName: table,
                Key: {
                    PK: input.PK,
                    SK: input.SK,
                },
            })
            .promise()
        return input
    }

    return {
        get,
        create,
        set,
        query,
        remove,
    }
}
