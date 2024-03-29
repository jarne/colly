/**
 * Colly | item preview controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import {
    getBasicMetadata,
    saveImageMetadata,
} from "./../../app/controller/itemPreview.js"
import item from "./../../app/controller/item.js"
import user from "./../../app/controller/user.js"

const Item = mongoose.model("Item")
const User = mongoose.model("User")

describe("item preview controller", () => {
    let userId

    before(async () => {
        await connectDbAsync()

        const createdUser = await user.create({
            username: "test-ctrl-preview-FrostyDragonfly",
            password: "Passw0rdM@n1@",
        })
        userId = createdUser.id
    })

    describe("#getBasicMetadata", () => {
        it("should fetch basic metadata infos", async () => {
            const meta = await getBasicMetadata(
                "http://127.0.0.1:3388/stellarvoyage/index.html"
            )

            expect(meta.title).to.equal("StellarVoyage")
            expect(meta.description).to.equal(
                "Embark on a cosmic journey with StellarVoyage - your portal to the wonders of space exploration."
            )
        })

        it("should return no metadata", async () => {
            const meta = await getBasicMetadata(
                "http://127.0.0.1:3388/coffeelovers-no-meta/index.html"
            )

            expect(meta.title).to.be.null
            expect(meta.description).to.be.null
        })
    })

    describe("#saveImageMetadata", () => {
        it("should fetch image metadata infos", async () => {
            const created = await item.create({
                url: "http://127.0.0.1:3388/stellarvoyage/index.html",
                name: "test-ctrl-preview-StellarVoyage",
                description:
                    "Embark on a cosmic journey with StellarVoyage - your portal to the wonders of space exploration.",
                owner: userId,
            })

            const refs = await saveImageMetadata(created.id)

            expect(refs.logo.toString()).to.have.length(36)
            expect(refs.image.toString()).to.have.length(36)
        })

        it("should return no metadata images", async () => {
            const created = await item.create({
                url: "http://127.0.0.1:3388/coffeelovers-no-meta/index.html",
                name: "test-ctrl-preview-Coffee Lover's Haven",
                description: "Welcome to the World of Coffee",
                owner: userId,
            })

            const refs = await saveImageMetadata(created.id)

            expect(refs.logo).to.be.undefined
            expect(refs.image).to.be.undefined
        })

        it("should not return invalid metadata images", async () => {
            const created = await item.create({
                url: "http://127.0.0.1:3388/mountainexploration-invalid-meta/index.html",
                name: "test-ctrl-preview-Mountain Exploration",
                description:
                    "Embark on an adventure to explore majestic mountains and breathtaking landscapes.",
                owner: userId,
            })

            const refs = await saveImageMetadata(created.id)

            expect(refs.logo).to.be.undefined
            expect(refs.image).to.be.undefined
        })
    })

    afterEach(async () => {
        await Item.findOneAndDelete({
            name: /^test-ctrl-preview-.*/,
        })
    })

    after(async () => {
        await User.findByIdAndDelete(userId)
    })
})
