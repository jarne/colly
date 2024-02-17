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

    before(function (done) {
        const prepare = async () => {
            const createdUser = await user.create({
                username: "itemroutetester",
                password: "testPW123",
            })

            uid = createdUser.id
            token = user.generateToken(createdUser)

            const createdTag = await tag.create({
                name: "itemroutetesttag",
                firstColor: "000000",
                secondColor: "ffffff",
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
                    url: "https://www.example.com",
                    name: "route example page",
                    description: "is an example",
                    tags: [tid],
                })

            expect(res.status).to.eq(200)
            expect(res.body.id).to.be.not.null

            const newItem = await controller.getById(res.body.id)

            expect(newItem.name).to.equal("route example page")
        })
    })

    describe("patch /api/item/:id", () => {
        it("should update the item", async () => {
            const created = await controller.create({
                url: "https://www.example.com",
                name: "route example page",
                description: "is an example",
                owner: uid,
                tags: [tid],
            })

            const res = await request(app)
                .patch(`/api/item/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "route other page",
                    description: "changed example page",
                })

            expect(res.status).to.eq(200)

            const updatedItem = await controller.getById(res.body.id)

            expect(updatedItem.name).to.equal("route other page")
            expect(updatedItem.description).to.equal("changed example page")
            expect(updatedItem.url).to.equal("https://www.example.com")
        })
    })

    describe("delete /api/item/:id", () => {
        it("should delete the created item", async () => {
            const created = await controller.create({
                url: "https://www.example.com",
                name: "route example page",
                description: "is an example",
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
            name: {
                $in: ["route example page", "route other page"],
            },
        })
    })

    after(async () => {
        await User.findByIdAndDelete(uid)
        await Tag.findByIdAndDelete(tid)
    })
})
