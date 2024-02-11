/**
 * Colly | tag controller
 */

import mongoose from "mongoose"

import crudController from "./common/crud.js"

const Tag = mongoose.model("Tag")
const crud = crudController(Tag)

export default {
    create: crud.create,
    update: crud.update,
    del: crud.del,
    getById: crud.getById,
    list: crud.list,
}
