/**
 * Colly | insert test data into database
 */

import mongoose from "mongoose"
import { promises as fs } from "fs"

import { connectDbAsync } from "./app/init.js"

await connectDbAsync()

const User = mongoose.model("User")
const Tag = mongoose.model("Tag")
const Item = mongoose.model("Item")

const userContent = await fs.readFile("./test-data/content/user.json", "utf8")
const tagContent = await fs.readFile("./test-data/content/tag.json", "utf8")
const itemContent = await fs.readFile("./test-data/content/item.json", "utf8")

const users = JSON.parse(userContent)
const tags = JSON.parse(tagContent)
const items = JSON.parse(itemContent)

await User.collection.drop()
await Tag.collection.drop()
await Item.collection.drop()

console.log("Deleted existing data")

await User.collection.insertMany(users)
await Tag.collection.insertMany(tags)
await Item.collection.insertMany(items)

console.log("Imported test data")
