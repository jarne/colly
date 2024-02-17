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
                username: "tagroutetester",
                password: "testPW123",
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
                    name: "routetesttag",
                    firstColor: "000000",
                    secondColor: "ffffff",
                })

            expect(res.status).to.eq(200)
            expect(res.body.id).to.be.not.null

            const newTag = await controller.getById(res.body.id)

            expect(newTag.name).to.equal("routetesttag")
        })
    })

    describe("patch /api/tag/:id", () => {
        it("should update the tag", async () => {
            const created = await controller.create({
                name: "routetesttag",
                firstColor: "000000",
                secondColor: "ffffff",
                owner: uid,
            })

            const res = await request(app)
                .patch(`/api/tag/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "routeothertag",
                    firstColor: "b5b5b5",
                })

            expect(res.status).to.eq(200)

            const updatedTag = await controller.getById(res.body.id)

            expect(updatedTag.name).to.equal("routeothertag")
            expect(updatedTag.firstColor).to.equal("b5b5b5")
            expect(updatedTag.secondColor).to.equal("ffffff")
        })
    })

    describe("delete /api/tag/:id", () => {
        it("should delete the created tag", async () => {
            const created = await controller.create({
                name: "routetesttag",
                firstColor: "000000",
                secondColor: "ffffff",
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
            name: {
                $in: ["routetesttag", "routeothertag"],
            },
        })
    })

    after(async () => {
        await User.findByIdAndDelete(uid)
    })
})
