/**
 * Colly | migration to change items/tags associated to a user to be
 * associated to a workspace
 */

import mongoose from "mongoose"
import logger from "./../util/logger.js"

const Item = mongoose.model("Item")
const Tag = mongoose.model("Tag")
const Workspace = mongoose.model("Workspace")

export const associateItemsAndTags = async () => {
    const itemOwners = await Item.distinct("owner", {
        owner: { $exists: true },
    })
    const tagOwners = await Tag.distinct("owner", { owner: { $exists: true } })
    const allOwnerIds = Array.from(
        new Set([...itemOwners, ...tagOwners].map((id) => id.toString()))
    )

    // create a default workspace for each owner
    const ownerWorkspaceMap = {}
    for (const ownerId of allOwnerIds) {
        const workspace = await Workspace.create({
            name: `Default Workspace`,
            members: [
                {
                    user: ownerId,
                    permissionLevel: "admin",
                },
            ],
        })
        ownerWorkspaceMap[ownerId] = workspace._id
    }

    // associate items with the default workspace
    const items = await Item.find({ owner: { $exists: true } })
    for (const item of items) {
        const workspaceId = ownerWorkspaceMap[item.owner.toString()]
        if (workspaceId) {
            item.workspace = workspaceId
            item.owner = undefined
            await item.save()
        }
    }

    // associate tags with the default workspace
    const tags = await Tag.find({ owner: { $exists: true } })
    for (const tag of tags) {
        const workspaceId = ownerWorkspaceMap[tag.owner.toString()]
        if (workspaceId) {
            tag.workspace = workspaceId
            tag.owner = undefined
            await tag.save()
        }
    }

    logger.info("workspace_associate_migration_completed")
}
