/**
 * Colly | tag router tests
 */

import { expect } from "chai"
import request from "supertest"
import mongoose from "mongoose"

import app from "./../../appInit.js"
import controller from "./../../app/controller/tag.js"
import user from "./../../app/controller/user.js"

const Tag = mongoose.model("Tag")
const User = mongoose.model("User")

describe("tag router", () => {
    let uid
    let token

    before(function (done) {
        const prepare = async () => {
            const created = await user.create({
                username: "test-route-tag-AquaLioness",
                password: "Saf3Gu@rd2024!",
            })

            uid = created.id
            token = user.generateToken(created)

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

    describe("post /api/tag", () => {
        it("should create a new tag", async () => {
            const res = await request(app)
                .post("/api/tag")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "test-route-tag-cosmic-adventures",
                    firstColor: "ff7f50",
                    secondColor: "ff4f4f",
                })

            expect(res.status).to.eq(200)
            expect(res.body.id).to.be.not.null

            const newTag = await controller.getById(res.body.id)

            expect(newTag.name).to.equal("test-route-tag-cosmic-adventures")
        })
    })

    describe("patch /api/tag/:id", () => {
        it("should update the tag", async () => {
            const created = await controller.create({
                name: "test-route-tag-enchanted-gardens",
                firstColor: "2ecc71",
                secondColor: "3498db",
                owner: uid,
            })

            const res = await request(app)
                .patch(`/api/tag/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "test-route-tag-pixel-perfection",
                    firstColor: "e74c3c",
                })

            expect(res.status).to.eq(200)

            const updatedTag = await controller.getById(res.body.id)

            expect(updatedTag.name).to.equal("test-route-tag-pixel-perfection")
            expect(updatedTag.firstColor).to.equal("e74c3c")
            expect(updatedTag.secondColor).to.equal("3498db")
        })
    })

    describe("delete /api/tag/:id", () => {
        it("should delete the created tag", async () => {
            const created = await controller.create({
                name: "test-route-tag-mystical-wanderlust",
                firstColor: "3498db",
                secondColor: "2c3e50",
                owner: uid,
            })

            const res = await request(app)
                .delete(`/api/tag/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.id).to.eq(created.id)

            const deletedTag = await controller.getById(created.id)

            expect(deletedTag).to.be.null
        })
    })

    describe("get /api/tag", () => {
        it("should list all tags", async () => {
            const res = await request(app)
                .get("/api/tag")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.data).to.be.an("array")
        })
    })

    afterEach(async () => {
        await Tag.findOneAndDelete({
            name: /^test-route-tag-.*/,
        })
    })

    after(async () => {
        await User.findByIdAndDelete(uid)
    })
})
