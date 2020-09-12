const awssail = require("aws-sail")

const { db } = awssail({
    setup: {
        mode: "local",
    },

    db: {
        table: "ExampleTable",
        region: "ExampleRegion",
    },
})

describe("awssail", () => {
    test("local version of aws sail works", async () => {
        await db.create({
            PK: "something",
            SK: "note_@id",
        })

        await db.create({
            PK: "something",
            SK: "note_@id",
        })

        const queryResult1 = await db.query({
            PK: "something",
            SK: "note_",
        })

        expect(queryResult1.length).toBe(2)

        const setResult = await db.set({
            PK: "something",
            SK: queryResult1[0].SK,
            content: "Hello",
        })

        expect(setResult).toEqual({
            PK: "something",
            SK: queryResult1[0].SK,
            content: "Hello",
        })

        await db.remove({
            PK: "something",
            SK: queryResult1[0].SK,
        })

        const queryResult2 = await db.query({
            PK: "something",
            SK: "note_",
        })

        expect(queryResult2.length).toBe(1)
    })
})
