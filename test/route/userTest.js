/**
 * Colly | user router tests
 */

import { expect } from "chai"
import request from "supertest"
import mongoose from "mongoose"

import app from "./../../appInit.js"
import user from "./../../app/controller/user.js"

const User = mongoose.model("User")

describe("user router", () => {
    let token

    before(function (done) {
        const prepare = async () => {
            await user.create({
                username: "routetestadmin",
                password: "testPW123",
                isAdmin: true,
            })

            const res = await request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "routetestadmin",
                    password: "testPW123",
                })

            token = res.body.token

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

    describe("post /api/user", () => {
        it("should create a new user", async () => {
            const res = await request(app)
                .post("/api/user")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "routetestuser",
                    password: "testPW123",
                })

            expect(res.status).to.eq(200)
            expect(res.body.id).to.be.not.null

            const newUser = await user.getById(res.body.id)

            expect(newUser.username).to.equal("routetestuser")
        })
    })

    describe("patch /api/user/:id", () => {
        it("should update the user", async () => {
            const created = await user.create({
                username: "routetestuser",
                password: "testPW123",
            })

            const res = await request(app)
                .patch(`/api/user/${created.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "newtestuser",
                    isAdmin: true,
                })

            expect(res.status).to.eq(200)

            const updatedUser = await user.getById(res.body.id)

            expect(updatedUser.username).to.equal("newtestuser")
            expect(updatedUser.isAdmin).to.be.true
        })
    })

    describe("delete /api/user/:id", () => {
        it("should delete the created user", async () => {
            const created = await user.create({
                username: "routetestuser",
                password: "testPW123",
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
            username: {
                $in: ["routetestuser", "newtestuser"],
            },
        })
    })

    after(async () => {
        await User.findOneAndDelete({
            username: "routetestadmin",
        })
    })
})
