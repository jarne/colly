/**
 * Colly | item controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import {
    createItem,
    deleteItem,
    listItems,
} from "./../../app/controller/item.js"
import { createUser } from "./../../app/controller/user.js"

const Item = mongoose.model("Item")
const User = mongoose.model("User")

describe("item controller", () => {
    let userId

    before(async () => {
        await connectDbAsync()

        const createdUser = await createUser("itemtester", "testPW123")
        userId = createdUser._id
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

    afterEach(async () => {
        await Item.findOneAndDelete({
            name: "example page",
        })
    })

    after(async () => {
        await User.findByIdAndDelete(userId)
    })
})
