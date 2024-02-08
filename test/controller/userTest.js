/**
 * Colly | user controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import controller from "./../../app/controller/user.js"

const User = mongoose.model("User")

describe("user controller", () => {
    before(async () => {
        await connectDbAsync()
    })

    describe("#create", () => {
        it("should create a new user", async () => {
            const user = await controller.create({
                username: "testuser",
                password: "testPW123",
            })

            expect(user.id).to.be.not.null
            expect(user.username).to.equal("testuser")
        })

        it("should create an admin user", async () => {
            const user = await controller.create({
                username: "testuser",
                password: "testPW123",
                isAdmin: true,
            })

            expect(user.id).to.be.not.null
            expect(user.isAdmin).to.be.true
        })

        it("throws error with invalid username", async () => {
            try {
                await controller.create({
                    username: "some Test User $!",
                    password: "testPW123",
                })
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })
    })

    describe("#update", () => {
        it("should update a created user", async () => {
            const user = await controller.create({
                username: "testuser",
                password: "testPW123",
            })

            expect(user.username).to.equal("testuser")
            expect(user.isAdmin).to.be.false

            const updatedUser = await controller.update(user.id, {
                username: "otheruser",
                isAdmin: true,
            })

            expect(updatedUser.username).to.equal("otheruser")
            expect(updatedUser.isAdmin).to.be.true
        })

        it("throws error for non-existing user", async () => {
            try {
                await controller.update("6675932d4f2094eb2ec739ad", {
                    username: "otheruser",
                    isAdmin: true,
                })
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#del", () => {
        it("should delete the new user", async () => {
            const user = await controller.create({
                username: "testuser",
                password: "testPW123",
            })

            await controller.del(user.id)
        })

        it("should delete not existing user", async () => {
            await controller.del("6675932d4f2094eb2ec739ad")
        })
    })

    describe("#list", () => {
        it("should return empty user list", async () => {
            const users = await controller.list()

            expect(users).to.be.an("array")
        })

        it("should return created user list", async () => {
            await controller.create({
                username: "testuser",
                password: "testPW123",
            })

            const users = await controller.list()

            expect(users.some((usrObj) => usrObj.username === "testuser")).to.be
                .true
        })
    })

    afterEach(async () => {
        await User.findOneAndDelete({
            username: {
                $in: ["testuser", "otheruser"],
            },
        })
    })
})
