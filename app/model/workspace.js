/**
 * Colly | workspace model
 */

import mongoose from "mongoose"

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

export default mongoose.model("Workspace", WorkspaceSchema)
