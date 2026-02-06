/**
 * Colly | insert test data into database
 */

import mongoose from "mongoose"
import { promises as fs } from "fs"

import { connectDbAsync } from "./src/init.js"
import { trySaveImageMetadata } from "./src/controller/itemPreview.js"

const User = mongoose.model("User")
const Workspace = mongoose.model("Workspace")
const Tag = mongoose.model("Tag")
const Item = mongoose.model("Item")

const deleteData = async () => {
    await User.collection.drop()
    await Workspace.collection.drop()
    await Tag.collection.drop()
    await Item.collection.drop()
}

const replaceDbTypesInObject = (obj) => {
    for (const key in obj) {
        const val = obj[key]

        if (val.$oid !== undefined) {
            obj[key] = new mongoose.Types.ObjectId(val.$oid)
        } else if (val.$binary !== undefined) {
            obj[key] = Buffer.from(val.$binary.base64, "base64")
        } else if (typeof val === "object") {
            if (key === "parent") {
                continue
            }

            obj[key] = replaceDbTypesInObject(val)
        }
    }

    return obj
}

const convertDbTypes = (data) => {
    return data.map(replaceDbTypesInObject)
}

const importData = async () => {
    const userContent = await fs.readFile(
        "./test-data/content/users.json",
        "utf8"
    )
    const workspaceContent = await fs.readFile(
        "./test-data/content/workspaces.json",
        "utf8"
    )
    const tagContent = await fs.readFile(
        "./test-data/content/tags.json",
        "utf8"
    )
    const itemContent = await fs.readFile(
        "./test-data/content/items.json",
        "utf8"
    )

    const users = JSON.parse(userContent)
    const workspaces = JSON.parse(workspaceContent)
    const tags = JSON.parse(tagContent)
    const items = JSON.parse(itemContent)

    await User.collection.insertMany(convertDbTypes(users))
    await Workspace.collection.insertMany(convertDbTypes(workspaces))
    await Tag.collection.insertMany(convertDbTypes(tags))
    await Item.collection.insertMany(convertDbTypes(items))

    for (const item of items) {
        trySaveImageMetadata(item._id)
    }
}

await connectDbAsync()

await deleteData()
console.log("Deleted existing data")

await importData()
console.log("Imported test data")
