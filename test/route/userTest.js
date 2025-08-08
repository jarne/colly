/**
 * Colly | user router tests
 */

import { expect } from "chai"
import request from "supertest"
import mongoose from "mongoose"

import app from "./../../appInit.js"
import user from "./../../app/controller/user.js"

const User = mongoose.model("User")

const TEST_PREFIX = "test-route-user-"

const ADMIN_USER = `${TEST_PREFIX}tech_guru88`
const ADMIN_PASSWORD = "Pr0t3ctYourD@t@"

describe("user router", () => {
    let token

    before(function (done) {
        const prepare = async () => {
            const created = await user.create({
                username: ADMIN_USER,
                password: ADMIN_PASSWORD,
                isAdmin: true,
            })

            token = user.generateToken(created)

            done()
        }

        if (mongoose.connection.readyState === 1) {
            ;(async () => {
                await prepare()
            })()
        }

        mongoose.connection.on("connected", prepare)
    })

    describe("post /api/user", () => {
        it("should create a new user", async () => {
            const res = await request(app)
                .post("/api/user")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: `${TEST_PREFIX}tmp-gaming_master777`,
                    password: "C9b3rS3cur!ty",
                })

            expect(res.status).to.eq(200)
            expect(res.body.id).to.be.not.null

            const newUser = await user.getById(res.body.id)

            expect(newUser.username).to.equal(
                `${TEST_PREFIX}tmp-gaming_master777`
            )
        })
    })

    describe("patch /api/user/:id", () => {
        it("should update the user", async () => {
            const created = await user.create({
                username: `${TEST_PREFIX}tmp-happy_camper42`,
                password: "Secur1tyIsK3y!",
            })

            const res = await request(app)
                .patch(`/api/user/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: `${TEST_PREFIX}tmp-art_enthusiast23`,
                    isAdmin: true,
                })

            expect(res.status).to.eq(200)

            const updatedUser = await user.getById(res.body.id)

            expect(updatedUser.username).to.equal(
                `${TEST_PREFIX}tmp-art_enthusiast23`
            )
            expect(updatedUser.isAdmin).to.be.true
        })
    })

    describe("delete /api/user/:id", () => {
        it("should delete the created user", async () => {
            const created = await user.create({
                username: `${TEST_PREFIX}tmp-ThunderPanda23`,
                password: "Hack3rPr00fP@ss",
            })

            const res = await request(app)
                .delete(`/api/user/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.id).to.eq(created.id)

            const deletedUser = await user.getById(created.id)

            expect(deletedUser).to.be.null
        })
    })

    describe("get /api/user", () => {
        it("should list all users", async () => {
            const res = await request(app)
                .get("/api/user")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.data).to.be.an("array")
        })
    })

    afterEach(async () => {
        await User.findOneAndDelete({
            username: /^test-route-user-tmp-.*/,
        })
    })

    after(async () => {
        await User.findOneAndDelete({
            username: ADMIN_USER,
        })
    })
})
