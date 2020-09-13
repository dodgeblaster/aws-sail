const { db, hook, http } = require("../_common/sail")

const main = async (event) => {
    try {
        const id = event.pathParameters.id
        const result = await db.get({
            PK: "something",
            SK: id,
        })

        return http.success(result)
    } catch (e) {
        return http.serverError(e)
    }
}

const test = async ({ axios, url }) => {
    const x = await db.create({
        PK: "something",
        SK: "note_@id",
        comment: "Hello",
    })

    const res = await axios(url + "/get/" + x.SK)
    console.log("GET RESULT: ", res.data)
    console.log("GET RESULT 2: ", x)
    await db.remove(x)

    if (res.data.PK !== x.PK) {
        return { success: false }
    }

    if (res.data.SK !== x.SK) {
        return { success: false }
    }

    if (res.data.comment !== x.comment) {
        return { success: false }
    }

    return { success: true }
}

module.exports.main = main
module.exports.test = hook(test)
