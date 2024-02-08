/**
 * Colly | item controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import controller from "./../../app/controller/item.js"
import user from "./../../app/controller/user.js"
import tag from "./../../app/controller/tag.js"

const Item = mongoose.model("Item")
const User = mongoose.model("User")
const Tag = mongoose.model("Tag")

describe("item controller", () => {
    let userId
    let tagId

    before(async () => {
        await connectDbAsync()

        const createdUser = await user.create({
            username: "itemtester",
            password: "testPW123",
        })
        userId = createdUser.id
        const createdTag = await tag.create({
            name: "itemtesttag",
            firstColor: "000000",
            secondColor: "ffffff",
            owner: userId,
        })
        tagId = createdTag.id
    })

    describe("#create", () => {
        it("should create a new item", async () => {
            const item = await controller.create({
                url: "https://www.example.com",
                name: "example page",
                description: "is an example",
                owner: userId,
                tags: [tagId],
            })

            expect(item.id).to.be.not.null
            expect(item.url).to.equal("https://www.example.com")
            expect(item.name).to.equal("example page")
        })

        it("throws error with invalid url", async () => {
            try {
                await controller.create({
                    url: "htt ps:/www. $example.com",
                    name: "example page",
                    description: "is an example",
                    owner: userId,
                })
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })
    })

    describe("#update", () => {
        it("should update an item", async () => {
            const item = await controller.create({
                url: "https://www.example.com",
                name: "example page",
                description: "is an example",
                owner: userId,
            })

            expect(item.url).to.equal("https://www.example.com")
            expect(item.name).to.equal("example page")

            const updatedItem = await controller.update(item.id, {
                url: "https://www.test.com",
                name: "other page",
                description: "is an example",
                tags: [tagId],
            })

            expect(updatedItem.url).to.equal("https://www.test.com")
            expect(updatedItem.name).to.equal("other page")
            expect(updatedItem.tags).to.contain(tagId)
        })

        it("throws error for non-existing item", async () => {
            try {
                await controller.update("6675932d4f2094eb2ec739ad", {
                    url: "https://www.test.com",
                    name: "other page",
                    description: "is an example",
                })
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#delete", () => {
        it("should delete the new item", async () => {
            const item = await controller.create({
                url: "https://www.example.com",
                name: "example page",
                description: "is an example",
                owner: userId,
            })

            await controller.del(item.id)
        })
    })

    describe("#getById", () => {
        it("should get the new item", async () => {
            const item = await controller.create({
                url: "https://www.example.com",
                name: "example page",
                description: "is an example",
                owner: userId,
            })

            const gotItem = await controller.getById(item.id)

            expect(gotItem.id).to.be.not.null
            expect(gotItem.url).to.equal("https://www.example.com")
            expect(gotItem.name).to.equal("example page")
        })

        it("should return null for non-existing item", async () => {
            const wrongItemId = "927546ad1438adb20df54d45"

            const gotItem = await controller.getById(wrongItemId)

            expect(gotItem).to.be.null
        })
    })

    describe("#list", () => {
        it("should return empty item list", async () => {
            const items = await controller.list()

            expect(items).to.be.an("array")
        })

        it("should return created item list", async () => {
            const item = await controller.create({
                url: "https://www.example.com",
                name: "example page",
                description: "is an example",
                owner: userId,
            })

            const items = await controller.list()

            expect(
                items.some(
                    (itemObj) => itemObj.url === "https://www.example.com"
                )
            ).to.be.true
        })
    })

    describe("#hasPermission", () => {
        it("should have the permission for the item", async () => {
            const item = await controller.create({
                url: "https://www.example.com",
                name: "example page",
                description: "is an example",
                owner: userId,
            })

            const hasPerm = await controller.hasPermission(item.id, userId)

            expect(hasPerm).to.be.true
        })

        it("should not have the permission for the item", async () => {
            const item = await controller.create({
                url: "https://www.example.com",
                name: "example page",
                description: "is an example",
                owner: userId,
            })

            const wrongUserId = "927546ad1438adb20df54d45"

            const hasPerm = await controller.hasPermission(item.id, wrongUserId)

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
        await Tag.findByIdAndDelete(tagId)
    })
})
