const { db, hook, http } = require("../_common/sail")

const main = async () => {
    try {
        const result = await db.query({
            PK: "something",
            SK: "note_",
        })

        return http.success(result)
    } catch (e) {
        return http.serverError(e)
    }
}

const test = async ({ axios, url }) => {
    await db.set({
        PK: "something",
        SK: "note_2000",
    })
    await db.set({
        PK: "something",
        SK: "note_2001",
    })
    const res = await axios(url + "/query")

    if (!res || !res.data) {
        return { success: false }
    }

    const success =
        res.data.filter((x) => x.SK === "note_2000" || x.SK === "note_2001")
            .length === 2

    await db.remove({
        PK: "something",
        SK: "note_2000",
    })
    await db.remove({
        PK: "something",
        SK: "note_2001",
    })

    if (!success) {
        return { success: false }
    }

    return { success: true }
}

module.exports.main = main
module.exports.test = hook(test)
