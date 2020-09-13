const { db, hook, http } = require("../_common/sail")

const main = async () => {
    try {
        const result = await db.remove({
            PK: "something",
            SK: "note_3001",
        })

        return http.success(result)
    } catch (e) {
        return http.serverError(e)
    }
}

const test = async ({ axios, url }) => {
    await db.set({
        PK: "something",
        SK: "note_3001",
    })

    const res = await axios(url + "/remove")
    console.log("____ ", res)

    if (!res || !res.data) {
        return { success: false }
    }

    if (res.data.PK !== "something") {
        return { success: false }
    }

    if (res.data.SK !== "note_3001") {
        return { success: false }
    }

    return { success: true }
}

module.exports.main = main
module.exports.test = hook(test)
