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

export default mongoose.model("Workspace", WorkspaceSchema)
