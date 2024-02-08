/**
 * Colly | auth router tests
 */

import { expect } from "chai"
import request from "supertest"
import mongoose from "mongoose"

import app from "./../../appInit.js"
import user from "./../../app/controller/user.js"

const User = mongoose.model("User")

describe("auth router", () => {
    before(function (done) {
        const prepare = async () => {
            await user.create({
                username: "routeauthtester",
                password: "testPW123",
                isAdmin: false,
            })

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

    describe("post /api/auth/login", () => {
        it("should authenticate successfully", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "routeauthtester",
                    password: "testPW123",
                })

            expect(res.status).to.eq(200)
            expect(res.body.token).to.be.not.null
            expect(res.body.user.username).to.eq("routeauthtester")
        })

        it("should fail auth with wrong credentials", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "routeauthtester",
                    password: "wrongPassword456",
                })

            expect(res.status).to.eq(401)
            expect(res.body.error).to.be.true
            expect(res.body.error_code).to.eq("invalid_credentials")
        })

        it("should fail auth with non-existing user", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "nottherouteauthtester",
                    password: "testPW123",
                })

            expect(res.status).to.eq(401)
            expect(res.body.error).to.be.true
            expect(res.body.error_code).to.eq("invalid_credentials")
        })
    })

    describe("get /api/auth/me", () => {
        it("should return user object", async () => {
            const authRes = await request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "routeauthtester",
                    password: "testPW123",
                })

            const token = authRes.body.token

            const res = await request(app)
                .get("/api/auth/me")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.user.username).to.eq("routeauthtester")
        })

        it("should throw error with invalid token", async () => {
            const token = "invalidToken123"

            const res = await request(app)
                .get("/api/auth/me")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(401)
            expect(res.text).to.include("Unauthorized")
        })

        it("should throw error without any token", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Content-Type", "application/json")
                .send()

            expect(res.status).to.eq(401)
            expect(res.text).to.include("Unauthorized")
        })
    })

    after(async () => {
        await User.findOneAndDelete({
            username: "routeauthtester",
        })
    })
})
