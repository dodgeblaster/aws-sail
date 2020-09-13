const { db, hook, http } = require("../_common/sail")

const main = async () => {
    try {
        const result = await db.set({
            PK: "something",
            SK: "note_1234",
            comment: "Hello2",
        })

        return http.success(result)
    } catch (e) {
        return http.serverError(e)
    }
}

const test = async ({ axios, url }) => {
    const res = await axios(url + "/put")

    if (!res || !res.data) {
        return { success: false }
    }

    await db.remove(res.data)

    if (res.data.PK !== "something") {
        return { success: false }
    }

    if (res.data.SK !== "note_1234") {
        return { success: false }
    }

    if (res.data.comment !== "Hello2") {
        return { success: false }
    }

    return { success: true }
}

module.exports.main = main
module.exports.test = hook(test)
