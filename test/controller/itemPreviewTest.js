/**
 * Colly | item preview controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../dist/init.js"
import {
    getBasicMetadata,
    saveImageMetadata,
} from "./../../dist/controller/itemPreview.js"
import item from "./../../dist/controller/item.js"
import user from "./../../dist/controller/user.js"

const Item = mongoose.model("Item")
const User = mongoose.model("User")
const Workspace = mongoose.model("Workspace")

const TEST_PREFIX = "test-ctrl-preview-"

describe("item preview controller", () => {
    let userId
    let wsId

    before(async () => {
        await connectDbAsync()

        const createdUser = await user.create({
            username: `${TEST_PREFIX}FrostyDragonfly`,
            password: "Passw0rdM@n1@",
        })
        userId = createdUser.id
        const createdWorkspace = await Workspace.create({
            name: `${TEST_PREFIX}The Stash!`,
            members: [
                {
                    user: userId,
                    permissionLevel: "admin",
                },
            ],
        })
        wsId = createdWorkspace.id
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
                name: `${TEST_PREFIX}StellarVoyage`,
                description:
                    "Embark on a cosmic journey with StellarVoyage - your portal to the wonders of space exploration.",
                workspace: wsId,
            })

            const refs = await saveImageMetadata(created.id)

            expect(refs.logo.toString()).to.have.length(36)
            expect(refs.image.toString()).to.have.length(36)
        })

        it("should return no metadata images", async () => {
            const created = await item.create({
                url: "http://127.0.0.1:3388/coffeelovers-no-meta/index.html",
                name: `${TEST_PREFIX}Coffee Lover's Haven`,
                description: "Welcome to the World of Coffee",
                workspace: wsId,
            })

            const refs = await saveImageMetadata(created.id)

            expect(refs.logo).to.be.undefined
            expect(refs.image).to.be.undefined
        })

        it("should not return invalid metadata images", async () => {
            const created = await item.create({
                url: "http://127.0.0.1:3388/mountainexploration-invalid-meta/index.html",
                name: `${TEST_PREFIX}Mountain Exploration`,
                description:
                    "Embark on an adventure to explore majestic mountains and breathtaking landscapes.",
                workspace: wsId,
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
        await Workspace.findByIdAndDelete(wsId)
        await User.findByIdAndDelete(userId)
    })
})
