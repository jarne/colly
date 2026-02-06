/**
 * Colly | item association to workspace migration tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../src/init.js"
import { associateItemsAndTags } from "./../../src/migration/itemWorkspaceRelations.js"
import tag from "./../../src/controller/tag.js"
import item from "./../../src/controller/item.js"
import user from "./../../src/controller/user.js"
import workspace from "./../../src/controller/workspace.js"

const User = mongoose.model("User")
const Workspace = mongoose.model("Workspace")
const Tag = mongoose.model("Tag")
const Item = mongoose.model("Item")

const TEST_PREFIX = "test-migr-workspace-"

describe("workspace association migration", () => {
    let userId

    before(async () => {
        await connectDbAsync()

        const createdUser = await user.create({
            username: `${TEST_PREFIX}MidnightJester88`,
            password: "CyberW@rri0r2024",
        })
        userId = createdUser.id
    })

    describe("#associateItemsAndTags", () => {
        it("should successfully migrate a tag with an owner associated", async () => {
            const tagObj = new Tag({
                name: `${TEST_PREFIX}financial-planning-tips`,
                firstColor: "9932cc",
                secondColor: "ff4500",
                owner: userId,
            })
            const createdTag = await tagObj.save({
                validateBeforeSave: false,
            })

            await associateItemsAndTags()

            const migratedTag = await tag.getById(createdTag.id)
            expect(migratedTag.owner).to.be.undefined
            expect(migratedTag.workspace).to.be.string

            const defaultWorkspace = await workspace.getById(
                migratedTag.workspace
            )
            expect(defaultWorkspace.name).to.eq("Default Workspace")
        })

        it("should successfully migrate an item with an owner associated", async () => {
            const itemObj = new Item({
                url: "http://example.com/moneymatters",
                name: `${TEST_PREFIX}MoneyMatters`,
                description:
                    "Learn smart financial management strategies and investment tips.",
                owner: userId,
            })
            const createdItem = await itemObj.save({
                validateBeforeSave: false,
            })

            await associateItemsAndTags()

            const migratedItem = await item.getById(createdItem.id)
            expect(migratedItem.owner).to.be.undefined
            expect(migratedItem.workspace).to.be.string
        })
    })

    afterEach(async () => {
        await Item.deleteMany({
            name: /^test-migr-workspace-.*/,
        })
        await Tag.deleteMany({
            name: /^test-migr-workspace-.*/,
        })
        await Workspace.findOneAndDelete({
            members: {
                $elemMatch: {
                    user: userId,
                    permissionLevel: "admin",
                },
            },
            name: "Default Workspace",
        })
    })

    after(async () => {
        await User.findByIdAndDelete(userId)
    })
})
