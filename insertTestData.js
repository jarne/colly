/**
 * Colly | insert test data into database
 */

import mongoose from "mongoose"
import { promises as fs } from "fs"

import { connectDbAsync } from "./app/init.js"
import { trySaveImageMetadata } from "./app/controller/itemPreview.js"

const User = mongoose.model("User")
const Tag = mongoose.model("Tag")
const Item = mongoose.model("Item")

const deleteData = async () => {
    await User.collection.drop()
    await Tag.collection.drop()
    await Item.collection.drop()
}

const replaceIdsInObject = (obj) => {
    for (const key in obj) {
        const val = obj[key]

        if (Array.isArray(val)) {
            obj[key] = replaceIdsInObject(val)
        }

        if (val.length === 24 && val[23] !== "=") {
            obj[key] = new mongoose.Types.ObjectId(val)
        }

        if (val.length === 24 && val[23] === "=") {
            obj[key] = new mongoose.Types.UUID(
                Buffer.from(val, "base64").toString("hex")
            )
        }
    }

    return obj
}

const convertIdsToObjectIds = (data) => {
    return data.map(replaceIdsInObject)
}

const importData = async () => {
    const userContent = await fs.readFile(
        "./test-data/content/user.json",
        "utf8"
    )
    const tagContent = await fs.readFile("./test-data/content/tag.json", "utf8")
    const itemContent = await fs.readFile(
        "./test-data/content/item.json",
        "utf8"
    )

    const users = JSON.parse(userContent)
    const tags = JSON.parse(tagContent)
    const items = JSON.parse(itemContent)

    await User.collection.insertMany(convertIdsToObjectIds(users))
    await Tag.collection.insertMany(convertIdsToObjectIds(tags))
    await Item.collection.insertMany(convertIdsToObjectIds(items))

    for (const item of items) {
        trySaveImageMetadata(item._id)
    }
}

await connectDbAsync()

await deleteData()
console.log("Deleted existing data")

await importData()
console.log("Imported test data")
