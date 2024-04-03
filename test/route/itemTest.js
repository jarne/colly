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
const Tag = mongoose.model("Tag")

describe("item router", () => {
    let uid
    let tid
    let token

    let rogueUid
    let rogueToken

    before(function (done) {
        const prepare = async () => {
            const createdUser = await user.create({
                username: "test-route-item-EmeraldPhoenix",
                password: "Encrypt10nRul3s",
            })
            uid = createdUser.id
            token = user.generateToken(createdUser)

            const createdRogueUser = await user.create({
                username: "test-route-item-MidnightSerenade",
                password: "TwilightMelody$123",
            })
            rogueUid = createdRogueUser.id
            rogueToken = user.generateToken(createdRogueUser)

            const createdTag = await tag.create({
                name: "test-route-item-rhythmic-melodies",
                firstColor: "1abc9c",
                secondColor: "f1c40f",
                owner: uid,
            })
            tid = createdTag.id

            done()
        }

        if (mongoose.connection.readyState === 1) {
            // eslint-disable-next-line no-extra-semi
            ;(async () => {
                await prepare()
            })()
        }

        mongoose.connection.on("connected", prepare)
    })

    describe("post /api/item", () => {
        it("should create a new item", async () => {
            const res = await request(app)
                .post("/api/item")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    url: "https://example.com/tech/gadgetgalaxy",
                    name: "test-route-item-GadgetGalaxy",
                    description:
                        "Explore the latest gadgets and tech innovations in one cosmic destination.",
                    tags: [tid],
                })

            expect(res.status).to.eq(200)
            expect(res.body.id).to.be.not.null

            const newItem = await controller.getById(res.body.id)

            expect(newItem.name).to.equal("test-route-item-GadgetGalaxy")
        })

        it("should fail with a permission error using foreign tags", async () => {
            const res = await request(app)
                .post("/api/item")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${rogueToken}`)
                .send({
                    url: "https://culinarycrafters.example.com/recipes",
                    name: "test-route-item-CulinaryCrafters",
                    description:
                        "CulinaryCrafters offers recipes, tutorials, and chef tips for food enthusiasts.",
                    tags: [tid],
                })

            expect(res.status).to.eq(403)
            expect(res.body.error.code).to.eq("insufficient_permission")
        })
    })

    describe("patch /api/item/:id", () => {
        it("should update the item", async () => {
            const created = await controller.create({
                url: "https://example.com/lifestyle/eco/ecoeden",
                name: "test-route-item-EcoEden",
                description:
                    "Dive into sustainable living with eco-friendly tips and green solutions.",
                owner: uid,
                tags: [tid],
            })

            const res = await request(app)
                .patch(`/api/item/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "test-route-item-WhimsyWanderer",
                    description:
                        "Embark on enchanting adventures and whimsical journeys across the globe.",
                })

            expect(res.status).to.eq(200)

            const updatedItem = await controller.getById(res.body.id)

            expect(updatedItem.name).to.equal("test-route-item-WhimsyWanderer")
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
                name: "test-route-item-EcoEcoEcho",
                description:
                    "Discover eco-friendly living tips and environmental news at EcoEcoEcho.",
                owner: uid,
                tags: [tid],
            })

            const res = await request(app)
                .patch(`/api/item/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${rogueToken}`)
                .send({
                    name: "test-route-item-FitFusionFitness",
                    description:
                        "Achieve your fitness goals with workout routines and nutrition advice at FitFusionFitness.",
                })

            expect(res.status).to.eq(403)
            expect(res.body.error.code).to.eq("insufficient_permission")
        })
    })

    describe("delete /api/item/:id", () => {
        it("should delete the created item", async () => {
            const created = await controller.create({
                url: "https://example.com/arts/crafty/canvas",
                name: "test-route-item-CraftyCanvas",
                description:
                    "Unleash your creativity with DIY craft ideas and artistic inspirations.",
                owner: uid,
                tags: [tid],
            })

            const res = await request(app)
                .delete(`/api/item/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.id).to.eq(created.id)

            const deletedItem = await controller.getById(created.id)

            expect(deletedItem).to.be.null
        })
    })

    describe("get /api/item", () => {
        it("should list all items", async () => {
            const res = await request(app)
                .get("/api/item")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.data).to.be.an("array")
        })
    })

    afterEach(async () => {
        await Item.findOneAndDelete({
            name: /^test-route-item-.*/,
        })
    })

    after(async () => {
        await User.findByIdAndDelete(uid)
        await User.findByIdAndDelete(rogueUid)
        await Tag.findByIdAndDelete(tid)
    })
})
