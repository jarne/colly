/**
 * Colly | item router tests
 */

import { expect } from "chai"
import request from "supertest"
import mongoose from "mongoose"

import app from "./../../appInit.js"
import controller from "./../../app/controller/item.js"
import user from "./../../app/controller/user.js"
import tag from "./../../app/controller/tag.js"

const Item = mongoose.model("Item")
const User = mongoose.model("User")
const Workspace = mongoose.model("Workspace")
const Tag = mongoose.model("Tag")

const TEST_PREFIX = "test-route-item-"

describe("item router", () => {
    let uid
    let wsId
    let tid
    let token

    let rogueUid
    let rogueToken

    before(function (done) {
        const prepare = async () => {
            const createdUser = await user.create({
                username: `${TEST_PREFIX}EmeraldPhoenix`,
                password: "Encrypt10nRul3s",
            })
            uid = createdUser.id
            token = user.generateToken(createdUser)

            const createdRogueUser = await user.create({
                username: `${TEST_PREFIX}MidnightSerenade`,
                password: "TwilightMelody$123",
            })
            rogueUid = createdRogueUser.id
            rogueToken = user.generateToken(createdRogueUser)

            const createdWorkspace = await Workspace.create({
                name: `${TEST_PREFIX}Idea Crate`,
                members: [
                    {
                        user: uid,
                        permissionLevel: "admin",
                    },
                ],
            })
            wsId = createdWorkspace.id

            const createdTag = await tag.create({
                name: `${TEST_PREFIX}rhythmic-melodies`,
                firstColor: "1abc9c",
                secondColor: "f1c40f",
                workspace: wsId,
            })
            tid = createdTag.id

            done()
        }

        if (mongoose.connection.readyState === 1) {
            ;(async () => {
                await prepare()
            })()
        }

        mongoose.connection.on("connected", prepare)
    })

    describe("post /api/workspace/:wsId/item", () => {
        it("should create a new item", async () => {
            const res = await request(app)
                .post(`/api/workspace/${wsId}/item`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    url: "https://example.com/tech/gadgetgalaxy",
                    name: `${TEST_PREFIX}GadgetGalaxy`,
                    description:
                        "Explore the latest gadgets and tech innovations in one cosmic destination.",
                    tags: [tid],
                })

            expect(res.status).to.eq(200)
            expect(res.body.id).to.be.not.null

            const newItem = await controller.getById(res.body.id)

            expect(newItem.name).to.equal(`${TEST_PREFIX}GadgetGalaxy`)
        })

        it("should fail with a permission error using foreign tags", async () => {
            const res = await request(app)
                .post(`/api/workspace/${wsId}/item`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${rogueToken}`)
                .send({
                    url: "https://culinarycrafters.example.com/recipes",
                    name: `${TEST_PREFIX}CulinaryCrafters`,
                    description:
                        "CulinaryCrafters offers recipes, tutorials, and chef tips for food enthusiasts.",
                    tags: [tid],
                })

            expect(res.status).to.eq(403)
            expect(res.body.error.code).to.eq("insufficient_permission")
        })
    })

    describe("patch /api/workspace/:wsId/item/:id", () => {
        it("should update an item", async () => {
            const created = await controller.create({
                url: "https://example.com/lifestyle/eco/ecoeden",
                name: `${TEST_PREFIX}EcoEden`,
                description:
                    "Dive into sustainable living with eco-friendly tips and green solutions.",
                workspace: wsId,
                tags: [tid],
            })

            const res = await request(app)
                .patch(`/api/workspace/${wsId}/item/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: `${TEST_PREFIX}WhimsyWanderer`,
                    description:
                        "Embark on enchanting adventures and whimsical journeys across the globe.",
                })

            expect(res.status).to.eq(200)

            const updatedItem = await controller.getById(res.body.id)

            expect(updatedItem.name).to.equal(`${TEST_PREFIX}WhimsyWanderer`)
            expect(updatedItem.description).to.equal(
                "Embark on enchanting adventures and whimsical journeys across the globe."
            )
            expect(updatedItem.url).to.equal(
                "https://example.com/lifestyle/eco/ecoeden"
            )
        })

        it("should throw a permission error updating a foreign item", async () => {
            const created = await controller.create({
                url: "https://ecoecoecho.example.com/lifestyle",
                name: `${TEST_PREFIX}EcoEcoEcho`,
                description:
                    "Discover eco-friendly living tips and environmental news at EcoEcoEcho.",
                workspace: wsId,
                tags: [tid],
            })

            const res = await request(app)
                .patch(`/api/workspace/${wsId}/item/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${rogueToken}`)
                .send({
                    name: `${TEST_PREFIX}FitFusionFitness`,
                    description:
                        "Achieve your fitness goals with workout routines and nutrition advice at FitFusionFitness.",
                })

            expect(res.status).to.eq(403)
            expect(res.body.error.code).to.eq("insufficient_permission")
        })
    })

    describe("delete /api/workspace/:wsId/item/:id", () => {
        it("should delete an item", async () => {
            const created = await controller.create({
                url: "https://example.com/arts/crafty/canvas",
                name: `${TEST_PREFIX}CraftyCanvas`,
                description:
                    "Unleash your creativity with DIY craft ideas and artistic inspirations.",
                workspace: wsId,
                tags: [tid],
            })

            const res = await request(app)
                .delete(`/api/workspace/${wsId}/item/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.id).to.eq(created.id)

            const deletedItem = await controller.getById(created.id)

            expect(deletedItem).to.be.null
        })
    })

    describe("get /api/workspace/:wsId/item", () => {
        it("should list all items", async () => {
            const res = await request(app)
                .get(`/api/workspace/${wsId}/item`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.data).to.be.an("array")
        })
    })

    describe("post /api/workspace/:wsId/item/meta", () => {
        it("should fetch the meta data of a web page", async () => {
            const res = await request(app)
                .post(`/api/workspace/${wsId}/item/meta`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    url: "http://127.0.0.1:3388/stellarvoyage/index.html",
                })

            expect(res.status).to.eq(200)
            expect(res.body.meta.title).to.equal("StellarVoyage")
            expect(res.body.meta.description).to.equal(
                "Embark on a cosmic journey with StellarVoyage - your portal to the wonders of space exploration."
            )
        })
    })

    describe("post /api/workspace/:wsId/item/:id/updateMetaImage", () => {
        it("should trigger a meta data update for an item", async () => {
            const created = await controller.create({
                url: "http://example.com/food/culinary/canvas",
                name: `${TEST_PREFIX}CulinaryCanvas`,
                description:
                    "Discover a palette of flavors with mouthwatering recipes and culinary delights.",
                workspace: wsId,
                tags: [tid],
            })

            const res = await request(app)
                .post(
                    `/api/workspace/${wsId}/item/${created.id}/updateMetaImage`
                )
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(204)
        })
    })

    afterEach(async () => {
        await Item.findOneAndDelete({
            name: /^test-route-item-.*/,
        })
    })

    after(async () => {
        await Tag.findByIdAndDelete(tid)
        await Workspace.findByIdAndDelete(wsId)
        await User.findByIdAndDelete(uid)
        await User.findByIdAndDelete(rogueUid)
    })
})
