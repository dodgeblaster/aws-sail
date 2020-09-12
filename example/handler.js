const awssail = require("aws-sail")

const { db } = awssail({
    setup: {
        mode: "real",
    },

    db: {
        table: process.env.TABLE,
        region: process.env.REGION,
    },
})

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

module.exports.get = httpTryCatch(async (event) => {
    const all = await db.query({
        PK: "something",
        SK: "note_",
    })
    return await db.get({
        PK: "something",
        SK: all[0].SK,
    })
})

module.exports.query = httpTryCatch(async (event) => {
    return await db.query({
        PK: "something",
        SK: "note_",
    })
})

module.exports.create = httpTryCatch(async (event) => {
    return await db.create({
        PK: "something",
        SK: "note_@id",
        comment: "Hello",
    })
})

module.exports.put = httpTryCatch(async (event) => {
    const all = await db.query({
        PK: "something",
        SK: "note_",
    })
    return await db.set({
        PK: "something",
        SK: all[0].SK,
        comment: "Hello 2",
    })
})

module.exports.remove = httpTryCatch(async (event) => {
    const all = await db.query({
        PK: "something",
        SK: "note_",
    })
    return await db.remove({
        PK: "something",
        SK: all[0].SK,
    })
})
