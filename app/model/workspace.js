/**
 * Colly | workspace model
 */

import mongoose from "mongoose"

import Item from "./item.js"
import Tag from "./tag.js"

const Schema = mongoose.Schema

const WorkspaceSchema = new Schema({
    name: {
        type: String,
        required: [true, "is required"],
    },
    members: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            permissionLevel: {
                type: String,
                enum: ["admin", "write", "read"],
                required: true,
            },
        },
    ],
})

/**
 * Validate to not allow duplicate users as members of the workspace
 */
WorkspaceSchema.path("members").validate((members) => {
    const seen = new Set()

    for (const member of members) {
        const uid = member.user.toString()

        if (seen.has(uid)) {
            return false
        }
        seen.add(uid)
    }

    return true
}, "duplicate members in workspace")

/**
 * Delete items and tags associated to workspace when deleting it
 */
WorkspaceSchema.pre("findOneAndDelete", async function () {
    const ws = await this.model.findOne(this.getFilter())

    if (ws) {
        await Item.deleteMany({ workspace: ws._id })
        await Tag.deleteMany({ workspace: ws._id })
    }
})

export default mongoose.model("Workspace", WorkspaceSchema)
