const { db, hook, http } = require("../_common/sail")

const main = async () => {
    try {
        const result = await db.create({
            PK: "something",
            SK: "note_@id",
            comment: "Hello2",
        })

        return http.success(result)
    } catch (e) {
        return http.serverError(e)
    }
}

const test = async ({ axios, url }) => {
    const res = await axios(url + "/create")

    if (!res || !res.data) {
        return { success: false }
    }

    await db.remove(res.data)

    if (res.data.PK !== "something") {
        return { success: false }
    }

    if (!res.data.SK) {
        return { success: false }
    }

    if (res.data.comment !== "Hello2") {
        return { success: false }
    }

    return { success: true }
}

module.exports.main = main
module.exports.test = hook(test)
