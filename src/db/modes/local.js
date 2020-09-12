const formatCreateItem = require('../../utils/formatKeys')
let db = []

module.exports = ({ table, region }) => {
 


    const get = (input) => {
        if (!input.SK) {
            throw new Error('Input must have SK defined')
        }

        if (input.PK) { 
            const res = db.filter(x => {
                return x.PK === input.PK && x.SK === input.SK
            })[0]
            return res || false
        }

        if (input.GSI1) {
            const res = db.filter(x => {
                return x.GSI1 === input.GSI1 && x.SK === input.SK
            })[0]
            return res || false
        }

        if (input.GSI2) {
            const res = db.filter(x => {
                return x.GSI2 === input.GSI2 && x.SK === input.SK
            })[0]
            return res || false
        }
        throw new Error('Input must have PK, GSI1, or GSI2 defined')
    }

    const query = (input) => {
        if (!input.SK) {
            throw new Error('Input must have SK defined')
        }

        if (!input.PK && !input.GSI1 && !input.GSI2) {
            throw new Error('Input must have either PK, GSI1, or GSI2 defined')
        }

        if (input.PK) { 
            const res = db.filter(x => {
                return x.PK === input.PK && x.SK.startsWith(input.SK)
            })

            return res || []
        }

        if (input.GSI1) { 
            const res = db.filter(x => {
                return x.GSI1 === input.GSI1 && x.SK.startsWith(input.SK)
            })

            return res || []
        }

        if (input.GSI2) {
            const res = db.filter(x => {
                return x.GSI2 === input.GSI2 && x.SK.startsWith(input.SK)
            })

            return res || []
        }
    }

    // TODO: create condition when using unique id
    // to only write if there is no existing item with same id
    const create = (input) => {
     


        if (!input.PK && !input.GSI1 && !input.GSI2) {
            throw new Error('create must have either PK, GSI1, or GSI2 defined')
        }

        if (!input.SK) {
            throw new Error('create must have a SK defined')
        }

        const createItem = async () => {
            const formattedInput = formatCreateItem(input)
            const res = db.filter(x => {
                return x.PK === formattedInput.PK && x.SK === formattedInput.SK
            })[0] || false

            if (res) { 
                throw new Error('ConditionalCheckFailedException')
            }

            db.push(formattedInput)
            return formattedInput
        }

        try {
            return await createItem()
        } catch (e) { 
            if (e.message.includes('ConditionalCheckFailedException')
                && input.SK.includes('@id')) {
                // could retry multiple times, but once might be enough
                return await createItem()
            }
            throw new Error(e)
        }
    }

    const put = (input) => {
        if (!input.PK && !input.GSI1 && !input.GSI2) {
            throw new Error('create must have either PK, GSI1, or GSI2 defined')
        }

        if (!input.SK) {
            throw new Error('create must have a SK defined')
        }

        const list = db.filter(x => {
            return !(x.PK === input.PK && x.SK === input.SK)
        })

        db = [
            ...list,
            input
        ]
        return input
    }



    const remove = (input) => {
        const list = db.filter(x => {
            return !(x.PK === input.PK && x.SK === input.SK)
        })

        db = [
            ...list
        ]
        return input
    }

    return {
        get,
        create,
        put,
        query,
        remove
    }
}