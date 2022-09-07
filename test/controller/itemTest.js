/**
 * Colly | item controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import {
    createItem,
    updateItem,
    deleteItem,
    getItem,
    listItems,
    hasPermission,
} from "./../../app/controller/item.js"
import { createUser } from "./../../app/controller/user.js"

const Item = mongoose.model("Item")
const User = mongoose.model("User")

describe("item controller", () => {
    let userId

    before(async () => {
        await connectDbAsync()

        const createdUser = await createUser("itemtester", "testPW123")
        userId = createdUser.id
    })

    describe("#createItem", () => {
        it("should create a new item", async () => {
            const item = await createItem(
                "https://www.example.com",
                "example page",
                "is an example",
                userId
            )

            expect(item.id).to.be.not.null
            expect(item.url).to.equal("https://www.example.com")
            expect(item.name).to.equal("example page")
        })

        it("throws error with invalid url", async () => {
            try {
                await createItem(
                    "htt ps:/www. $example.com",
                    "example page",
                    "is an example",
                    userId
                )
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })
    })

    describe("#updateItem", () => {
        it("should update an item", async () => {
            const item = await createItem(
                "https://www.example.com",
                "example page",
                "is an example",
                userId
            )

            expect(item.url).to.equal("https://www.example.com")
            expect(item.name).to.equal("example page")

            const updatedItem = await updateItem(
                item.id,
                "https://www.test.com",
                "other page",
                "is an example",
                userId
            )

            expect(updatedItem.url).to.equal("https://www.test.com")
            expect(updatedItem.name).to.equal("other page")
        })

        it("throws error for non-existing item", async () => {
            try {
                await updateItem(
                    "6675932d4f2094eb2ec739ad",
                    "https://www.test.com",
                    "other page",
                    "is an example",
                    userId
                )
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#deleteItem", () => {
        it("should delete the new item", async () => {
            const item = await createItem(
                "https://www.example.com",
                "example page",
                "is an example",
                userId
            )

            await deleteItem(item.id)
        })
    })

    describe("#getItem", () => {
        it("should get the new item", async () => {
            const item = await createItem(
                "https://www.example.com",
                "example page",
                "is an example",
                userId
            )

            const gotItem = await getItem(item.id)

            expect(gotItem.id).to.be.not.null
            expect(gotItem.url).to.equal("https://www.example.com")
            expect(gotItem.name).to.equal("example page")
        })

        it("should return null for non-existing item", async () => {
            const wrongItemId = "927546ad1438adb20df54d45"

            const gotItem = await getItem(wrongItemId)

            expect(gotItem).to.be.null
        })
    })

    describe("#listItems", () => {
        it("should return empty item list", async () => {
            const items = await listItems()

            expect(items).to.be.an("array")
        })

        it("should return created item list", async () => {
            await createItem(
                "https://www.example.com",
                "example page",
                "is an example",
                userId
            )

            const items = await listItems()

            expect(
                items.some(
                    (itemObj) => itemObj.url === "https://www.example.com"
                )
            ).to.be.true
        })
    })

    describe("#hasPermission", () => {
        it("should have the permission for the item", async () => {
            const item = await createItem(
                "https://www.example.com",
                "example page",
                "is an example",
                userId
            )

            const hasPerm = await hasPermission(item.id, userId)

            expect(hasPerm).to.be.true
        })

        it("should not have the permission for the item", async () => {
            const item = await createItem(
                "https://www.example.com",
                "example page",
                "is an example",
                userId
            )

            const wrongUserId = "927546ad1438adb20df54d45"

            const hasPerm = await hasPermission(item.id, wrongUserId)

            expect(hasPerm).to.be.false
        })
    })

    afterEach(async () => {
        await Item.findOneAndDelete({
            name: {
                $in: ["example page", "other page"],
            },
        })
    })

    after(async () => {
        await User.findByIdAndDelete(userId)
    })
})
