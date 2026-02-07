/**
 * Colly | tag router tests
 */

import { expect } from "chai"
import request from "supertest"
import mongoose from "mongoose"

import app from "./../../dist/appInit.js"
import controller from "./../../dist/controller/tag.js"
import user from "./../../dist/controller/user.js"

const Tag = mongoose.model("Tag")
const User = mongoose.model("User")
const Workspace = mongoose.model("Workspace")

const TEST_PREFIX = "test-route-tag-"

describe("tag router", () => {
    let uid
    let wsId
    let token

    before(function (done) {
        const prepare = async () => {
            const createdUser = await user.create({
                username: `${TEST_PREFIX}AquaLioness`,
                password: "Saf3Gu@rd2024!",
            })
            uid = createdUser.id
            token = user.generateToken(createdUser)

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

            done()
        }

        if (mongoose.connection.readyState === 1) {
            ;(async () => {
                await prepare()
            })()
        }

        mongoose.connection.on("connected", prepare)
    })

    describe("post /api/workspace/:wsId/tag", () => {
        it("should create a new tag", async () => {
            const res = await request(app)
                .post(`/api/workspace/${wsId}/tag`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: `${TEST_PREFIX}cosmic-adventures`,
                    firstColor: "ff7f50",
                    secondColor: "ff4f4f",
                })

            expect(res.status).to.eq(200)
            expect(res.body.id).to.be.not.null

            const newTag = await controller.getById(res.body.id)

            expect(newTag.name).to.equal(`${TEST_PREFIX}cosmic-adventures`)
        })

        it("should throw a duplicate error with duplicate tag name", async () => {
            await controller.create({
                name: `${TEST_PREFIX}photography-tips-tricks`,
                firstColor: "556b2f",
                secondColor: "b0e0e6",
                workspace: wsId,
            })

            const res = await request(app)
                .post(`/api/workspace/${wsId}/tag`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: `${TEST_PREFIX}photography-tips-tricks`,
                    firstColor: "ff1493",
                    secondColor: "00ced1",
                })

            expect(res.status).to.eq(400)
            expect(res.body.error.code).to.eq("duplicate_entry")
        })

        it("should throw a validation error with invalid color", async () => {
            const res = await request(app)
                .post(`/api/workspace/${wsId}/tag`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: `${TEST_PREFIX}beginner-yoga-poses`,
                    firstColor: "ff7fXX",
                    secondColor: "ff4f4f",
                })

            expect(res.status).to.eq(400)
            expect(res.body.error.code).to.eq("validation_error")
        })
    })

    describe("patch /api/workspace/:wsId/tag/:id", () => {
        it("should update the tag", async () => {
            const created = await controller.create({
                name: `${TEST_PREFIX}enchanted-gardens`,
                firstColor: "2ecc71",
                secondColor: "3498db",
                workspace: wsId,
            })

            const res = await request(app)
                .patch(`/api/workspace/${wsId}/tag/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: `${TEST_PREFIX}pixel-perfection`,
                    firstColor: "e74c3c",
                })

            expect(res.status).to.eq(200)

            const updatedTag = await controller.getById(res.body.id)

            expect(updatedTag.name).to.equal(`${TEST_PREFIX}pixel-perfection`)
            expect(updatedTag.firstColor).to.equal("e74c3c")
            expect(updatedTag.secondColor).to.equal("3498db")
        })
    })

    describe("delete /api/workspace/:wsId/tag/:id", () => {
        it("should delete the created tag", async () => {
            const created = await controller.create({
                name: `${TEST_PREFIX}mystical-wanderlust`,
                firstColor: "3498db",
                secondColor: "2c3e50",
                workspace: wsId,
            })

            const res = await request(app)
                .delete(`/api/workspace/${wsId}/tag/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.id).to.eq(created.id)

            const deletedTag = await controller.getById(created.id)

            expect(deletedTag).to.be.null
        })
    })

    describe("get /api/workspace/:wsId/tag", () => {
        it("should list all tags", async () => {
            const res = await request(app)
                .get(`/api/workspace/${wsId}/tag`)
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
        await Workspace.findByIdAndDelete(wsId)
        await User.findByIdAndDelete(uid)
    })
})
