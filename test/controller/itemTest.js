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
            username: "test-ctrl-item-cool_cat99",
            password: "Secret123$",
        })
        userId = createdUser.id
        const createdTag = await tag.create({
            name: "test-ctrl-item-photography-tips-tricks",
            firstColor: "ff1493",
            secondColor: "00ced1",
            owner: userId,
        })
        tagId = createdTag.id
    })

    describe("#create", () => {
        it("should create a new item", async () => {
            const item = await controller.create({
                url: "https://example.com/cooking101",
                name: "test-ctrl-item-Cooking 101",
                description:
                    "Your go-to resource for easy recipes and culinary tips.",
                owner: userId,
                tags: [tagId],
            })

            expect(item.id).to.be.not.null
            expect(item.url).to.equal("https://example.com/cooking101")
            expect(item.name).to.equal("test-ctrl-item-Cooking 101")
        })

        it("should create a new item with image metadata", async () => {
            const created = await controller.create({
                url: "http://127.0.0.1:3388/stellarvoyage/index.html",
                name: "test-ctrl-item-StellarVoyage",
                description:
                    "Embark on a cosmic journey with StellarVoyage - your portal to the wonders of space exploration.",
                owner: userId,
                tags: [tagId],
            })

            expect(created.id).to.be.not.null
            expect(created.name).to.equal("test-ctrl-item-StellarVoyage")

            await new Promise((resolve) => setTimeout(resolve, 3000))

            const item = await controller.getById(created.id)

            expect(item.image).to.be.not.null
            expect(item.logo).to.be.not.null
            expect(item.logoUrl).to.be.not.null
            expect(item.imageUrl).to.be.not.null
        }).timeout(5000)

        it("throws error with invalid url", async () => {
            try {
                await controller.create({
                    url: "htt:/example.com/fitnesshub",
                    name: "test-ctrl-item-Fitness Hub",
                    description:
                        "Get fit and stay healthy with expert workout routines and nutrition advice.",
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
                url: "https://example.com/travelinsider",
                name: "test-ctrl-item-TravelInsider",
                description:
                    "Discover hidden gems and travel hacks for your next adventure.",
                owner: userId,
            })

            expect(item.url).to.equal("https://example.com/travelinsider")
            expect(item.name).to.equal("test-ctrl-item-TravelInsider")

            const updatedItem = await controller.update(item.id, {
                url: "https://example.com/mindfulnessjourney",
                name: "test-ctrl-item-Mindfulness Journey",
                description:
                    "Begin your journey to inner peace and mindfulness with guided meditation sessions.",
                tags: [tagId],
            })

            expect(updatedItem.url).to.equal(
                "https://example.com/mindfulnessjourney"
            )
            expect(updatedItem.name).to.equal(
                "test-ctrl-item-Mindfulness Journey"
            )
            expect(updatedItem.tags).to.contain(tagId)
        })

        it("throws error for non-existing item", async () => {
            try {
                await controller.update("6675932d4f2094eb2ec739ad", {
                    url: "https://example.com/moneymatters",
                    name: "test-ctrl-item-MoneyMatters",
                    description:
                        "Learn smart financial management strategies and investment tips.",
                })
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#delete", () => {
        it("should delete the new item", async () => {
            const item = await controller.create({
                url: "https://example.com/techbuzz",
                name: "test-ctrl-item-TechBuzz",
                description:
                    "Stay updated with the latest in technology news and gadget reviews.",
                owner: userId,
            })

            await controller.del(item.id)
        })
    })

    describe("#getById", () => {
        it("should get the new item", async () => {
            const item = await controller.create({
                url: "https://example.com/fashionista",
                name: "test-ctrl-item-Fashionista",
                description:
                    "Your ultimate style guide for trends, fashion tips, and beauty hacks.",
                owner: userId,
            })

            const gotItem = await controller.getById(item.id)

            expect(gotItem.id).to.be.not.null
            expect(gotItem.url).to.equal("https://example.com/fashionista")
            expect(gotItem.name).to.equal("test-ctrl-item-Fashionista")
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
            await controller.create({
                url: "https://example.com/petparadise",
                name: "test-ctrl-item-#Pet #Paradise",
                description:
                    "Spoil your furry friends with pet care advice, training tips, and adorable pet photos.",
                owner: userId,
            })

            const items = await controller.list()

            expect(
                items.some(
                    (itemObj) =>
                        itemObj.url === "https://example.com/petparadise"
                )
            ).to.be.true
        })
    })

    describe("#hasPermission", () => {
        it("should have the permission for the item", async () => {
            const item = await controller.create({
                url: "https://example.com/homeimprovement",
                name: "test-ctrl-item-HomeImprovement",
                description:
                    "Transform your living space with DIY home decor ideas and renovation inspiration.",
                owner: userId,
            })

            const hasPerm = await controller.hasPermission(item.id, userId)

            expect(hasPerm).to.be.true
        })

        it("should not have the permission for the item", async () => {
            const item = await controller.create({
                url: "https://example.com/careerboost",
                name: "test-ctrl-item-Career!Boost",
                description:
                    "Take your career to the next level with expert advice on job hunting, resume building, and professional development.",
                owner: userId,
            })

            const wrongUserId = "927546ad1438adb20df54d45"

            const hasPerm = await controller.hasPermission(item.id, wrongUserId)

            expect(hasPerm).to.be.false
        })
    })

    afterEach(async () => {
        await Item.findOneAndDelete({
            name: /^test-ctrl-item-.*/,
        })
    })

    after(async () => {
        await User.findByIdAndDelete(userId)
        await Tag.findByIdAndDelete(tagId)
    })
})
