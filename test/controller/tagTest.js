/**
 * Colly | tag controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import {
    createTag,
    updateTag,
    deleteTag,
    listTags,
} from "./../../app/controller/tag.js"
import { createUser } from "./../../app/controller/user.js"

const Tag = mongoose.model("Tag")
const User = mongoose.model("User")

describe("tag controller", () => {
    let userId

    before(async () => {
        await connectDbAsync()

        const createdUser = await createUser("tagtester", "testPW123")
        userId = createdUser.id
    })

    describe("#createTag", () => {
        it("should create a new tag", async () => {
            const tag = await createTag("testtag", "000000", "ffffff", userId)

            expect(tag.id).to.be.not.null
            expect(tag.name).to.equal("testtag")
        })

        it("throws error with invalid tag name", async () => {
            try {
                await createTag("Tag ! ?", "000000", "ffffff", userId)
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })

        it("throws error with invalid color", async () => {
            try {
                await createTag("testtag", "0x000k", "ffffff", userId)
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })
    })

    describe("#updateTag", () => {
        it("should update a tag", async () => {
            const tag = await createTag("testtag", "000000", "ffffff", userId)

            expect(tag.name).to.equal("testtag")

            const updatedTag = await updateTag(
                tag.id,
                "othertag",
                "000000",
                "ffffff",
                userId
            )

            expect(updatedTag.name).to.equal("othertag")
        })

        it("throws error for non-existing tag", async () => {
            try {
                await updateTag(
                    "6675932d4f2094eb2ec739ad",
                    "othertag",
                    "000000",
                    "ffffff",
                    userId
                )
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#deleteTag", () => {
        it("should delete the new tag", async () => {
            const tag = await createTag("testtag", "000000", "ffffff", userId)

            await deleteTag(tag.id)
        })
    })

    describe("#listTags", () => {
        it("should return empty tag list", async () => {
            const tags = await listTags()

            expect(tags).to.be.an("array")
        })

        it("should return created tag list", async () => {
            await createTag("testtag", "000000", "ffffff", userId)

            const tags = await listTags()

            expect(tags.some((tagObj) => tagObj.name === "testtag")).to.be.true
        })
    })

    afterEach(async () => {
        await Tag.findOneAndDelete({
            name: {
                $in: ["testtag", "othertag"],
            },
        })
    })

    after(async () => {
        await User.findByIdAndDelete(userId)
    })
})
