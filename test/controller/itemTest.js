/**
 * Colly | item controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../dist/init.js"
import controller from "./../../dist/controller/item.js"
import user from "./../../dist/controller/user.js"
import tag from "./../../dist/controller/tag.js"

const Item = mongoose.model("Item")
const User = mongoose.model("User")
const Workspace = mongoose.model("Workspace")
const Tag = mongoose.model("Tag")

const TEST_PREFIX = "test-ctrl-item-"

describe("item controller", () => {
    let userId
    let wsId
    let tagId

    before(async () => {
        await connectDbAsync()

        const createdUser = await user.create({
            username: `${TEST_PREFIX}cool_cat99`,
            password: "Secret123$",
        })
        userId = createdUser.id
        const createdWorkspace = await Workspace.create({
            name: `${TEST_PREFIX}Bits & Pieces`,
            members: [
                {
                    user: userId,
                    permissionLevel: "admin",
                },
            ],
        })
        wsId = createdWorkspace.id
        const createdTag = await tag.create({
            name: `${TEST_PREFIX}photography-tips-tricks`,
            firstColor: "ff1493",
            secondColor: "00ced1",
            workspace: wsId,
        })
        tagId = createdTag.id
    })

    describe("#create", () => {
        it("should create a new item", async () => {
            const item = await controller.create({
                url: "https://example.com/cooking101",
                name: `${TEST_PREFIX}Cooking 101`,
                description:
                    "Your go-to resource for easy recipes and culinary tips.",
                workspace: wsId,
                tags: [tagId],
            })

            expect(item.id).to.be.not.null
            expect(item.url).to.equal("https://example.com/cooking101")
            expect(item.name).to.equal(`${TEST_PREFIX}Cooking 101`)
        })

        it("should create a new item with image metadata", async () => {
            const created = await controller.create({
                url: "http://127.0.0.1:3388/stellarvoyage/index.html",
                name: `${TEST_PREFIX}StellarVoyage`,
                description:
                    "Embark on a cosmic journey with StellarVoyage - your portal to the wonders of space exploration.",
                workspace: wsId,
                tags: [tagId],
            })

            expect(created.id).to.be.not.null
            expect(created.name).to.equal(`${TEST_PREFIX}StellarVoyage`)

            await new Promise((resolve) => setTimeout(resolve, 500))

            const item = await controller.getById(created.id)

            expect(item.image).to.be.not.null
            expect(item.logo).to.be.not.null
            expect(item.logoUrl).to.be.not.null
            expect(item.imageUrl).to.be.not.null
        })

        it("throws error with invalid url", async () => {
            try {
                await controller.create({
                    url: "htt:/example.com/fitnesshub",
                    name: `${TEST_PREFIX}Fitness Hub`,
                    description:
                        "Get fit and stay healthy with expert workout routines and nutrition advice.",
                    workspace: wsId,
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
                name: `${TEST_PREFIX}TravelInsider`,
                description:
                    "Discover hidden gems and travel hacks for your next adventure.",
                workspace: wsId,
            })

            expect(item.url).to.equal("https://example.com/travelinsider")
            expect(item.name).to.equal(`${TEST_PREFIX}TravelInsider`)

            const updatedItem = await controller.update(item.id, {
                url: "https://example.com/mindfulnessjourney",
                name: `${TEST_PREFIX}Mindfulness Journey`,
                description:
                    "Begin your journey to inner peace and mindfulness with guided meditation sessions.",
                tags: [tagId],
            })

            expect(updatedItem.url).to.equal(
                "https://example.com/mindfulnessjourney"
            )
            expect(updatedItem.name).to.equal(
                `${TEST_PREFIX}Mindfulness Journey`
            )
            expect(updatedItem.tags).to.contain(tagId)
        })

        it("throws error for non-existing item", async () => {
            try {
                await controller.update("6675932d4f2094eb2ec739ad", {
                    url: "https://example.com/moneymatters",
                    name: `${TEST_PREFIX}MoneyMatters`,
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
                name: `${TEST_PREFIX}TechBuzz`,
                description:
                    "Stay updated with the latest in technology news and gadget reviews.",
                workspace: wsId,
            })

            await controller.del(item.id)
        })
    })

    describe("#getById", () => {
        it("should get the new item", async () => {
            const item = await controller.create({
                url: "https://example.com/fashionista",
                name: `${TEST_PREFIX}Fashionista`,
                description:
                    "Your ultimate style guide for trends, fashion tips, and beauty hacks.",
                workspace: wsId,
            })

            const gotItem = await controller.getById(item.id)

            expect(gotItem.id).to.be.not.null
            expect(gotItem.url).to.equal("https://example.com/fashionista")
            expect(gotItem.name).to.equal(`${TEST_PREFIX}Fashionista`)
        })

        it("should return null for non-existing item", async () => {
            const wrongItemId = "927546ad1438adb20df54d45"

            const gotItem = await controller.getById(wrongItemId)

            expect(gotItem).to.be.null
        })
    })

    describe("#find", () => {
        it("should return empty item list", async () => {
            const items = await controller.find()

            expect(items).to.be.an("array")
        })

        it("should return created item list", async () => {
            await controller.create({
                url: "https://example.com/petparadise",
                name: `${TEST_PREFIX}#Pet #Paradise`,
                description:
                    "Spoil your furry friends with pet care advice, training tips, and adorable pet photos.",
                workspace: wsId,
            })

            const items = await controller.find()

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
                name: `${TEST_PREFIX}HomeImprovement`,
                description:
                    "Transform your living space with DIY home decor ideas and renovation inspiration.",
                workspace: wsId,
            })

            const hasAdmin = await controller.hasPermission(
                item.id,
                userId,
                "admin"
            )
            const hasWrite = await controller.hasPermission(
                item.id,
                userId,
                "write"
            )
            const hasRead = await controller.hasPermission(
                item.id,
                userId,
                "read"
            )

            expect(hasAdmin).to.be.true
            expect(hasWrite).to.be.true
            expect(hasRead).to.be.true
        })

        it("should not have the permission for the item", async () => {
            const item = await controller.create({
                url: "https://example.com/careerboost",
                name: `${TEST_PREFIX}Career!Boost`,
                description:
                    "Take your career to the next level with expert advice on job hunting, resume building, and professional development.",
                workspace: wsId,
            })

            const wrongUserId = "927546ad1438adb20df54d45"

            const hasAdmin = await controller.hasPermission(
                item.id,
                wrongUserId,
                "admin"
            )
            const hasWrite = await controller.hasPermission(
                item.id,
                wrongUserId,
                "write"
            )
            const hasRead = await controller.hasPermission(
                item.id,
                wrongUserId,
                "read"
            )

            expect(hasAdmin).to.be.false
            expect(hasWrite).to.be.false
            expect(hasRead).to.be.false
        })
    })

    afterEach(async () => {
        await Item.findOneAndDelete({
            name: /^test-ctrl-item-.*/,
        })
    })

    after(async () => {
        await Tag.findByIdAndDelete(tagId)
        await Workspace.findByIdAndDelete(wsId)
        await User.findByIdAndDelete(userId)
    })
})
