const awssail = require("aws-sail")

const { db, hook, httpTryCatch } = awssail({
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

module.exports.get = httpTryCatch(async (event) => {
    const id = event.pathParameters.id

    return await db.get({
        PK: "something",
        SK: id,
    })
})

module.exports.getHook = hook(async ({ axios, url, getMockedEvents }) => {
    // if (process.env.stage === "staging") {
    const x = await db.create({
        PK: "something",
        SK: "note_@id",
        comment: "Hello",
    })

    const res = await axios(url + "/get/" + x.SK)
    await db.remove(x)

    if (res.data === x) {
        return { success: true }
    }
    return { success: false }
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
