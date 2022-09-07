/**
 * Colly | user controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import {
    createUser,
    updateUser,
    deleteUser,
    listUsers,
} from "./../../app/controller/user.js"

const User = mongoose.model("User")

describe("user controller", () => {
    before(async () => {
        await connectDbAsync()
    })

    describe("#createUser", () => {
        it("should create a new user", async () => {
            const user = await createUser("testuser", "testPW123")

            expect(user.id).to.be.not.null
            expect(user.username).to.equal("testuser")
        })

        it("should create an admin user", async () => {
            const user = await createUser("testuser", "testPW123", true)

            expect(user.id).to.be.not.null
            expect(user.isAdmin).to.be.true
        })

        it("throws error with invalid username", async () => {
            try {
                await createUser("some Test User $!", "testPW123")
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })
    })

    describe("#updateUser", () => {
        it("should update a created user", async () => {
            const user = await createUser("testuser", "testPW123")

            expect(user.username).to.equal("testuser")
            expect(user.isAdmin).to.be.false

            const updatedUser = await updateUser(user.id, "otheruser", true)

            expect(updatedUser.username).to.equal("otheruser")
            expect(updatedUser.isAdmin).to.be.true
        })

        it("throws error for non-existing user", async () => {
            try {
                await updateUser("6675932d4f2094eb2ec739ad", "otheruser", true)
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#deleteUser", () => {
        it("should delete the new user", async () => {
            const user = await createUser("testuser", "testPW123")

            await deleteUser(user.id)
        })

        it("should delete not existing user", async () => {
            await deleteUser("6675932d4f2094eb2ec739ad")
        })
    })

    describe("#listUsers", () => {
        it("should return empty user list", async () => {
            const users = await listUsers()

            expect(users).to.be.an("array")
        })

        it("should return created user list", async () => {
            await createUser("testuser", "testPW123")

            const users = await listUsers()

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
