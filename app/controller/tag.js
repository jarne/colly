/**
 * Colly | tag controller
 */

import mongoose from "mongoose"

import NotFoundError from "./exception/notFoundError.js"

const Tag = mongoose.model("Tag")

/**
 * Create a new tag
 *
 * @param {string} name Tag name
 * @param {string} firstColor First gradient color
 * @param {string} secondColor Second gradient color
 * @param {string} ownerId Owner user ID
 *
 * @returns Tag object
 */
export const createTag = async (name, firstColor, secondColor, ownerId) => {
    const tag = new Tag()
    tag.name = name
    tag.firstColor = firstColor
    tag.secondColor = secondColor
    tag.owner = ownerId

    try {
        const savedTag = await tag.save()

        return savedTag
    } catch (e) {
        throw e
    }
}

/**
 * Update a tag
 *
 * @param {string} id Tag ID
 * @param {string} name Tag name
 * @param {string} firstColor First gradient color
 * @param {string} secondColor Second gradient color
 * @param {string} ownerId Owner user ID
 *
 * @returns Tag object
 */
export const updateTag = async (id, name, firstColor, secondColor, ownerId) => {
    let tag
    try {
        tag = await Tag.findById(id)
    } catch (e) {
        throw e
    }

    if (tag === null) {
        throw new NotFoundError()
    }

    tag.name = name
    tag.firstColor = firstColor
    tag.secondColor = secondColor
    tag.owner = ownerId

    try {
        const savedTag = await tag.save()

        return savedTag
    } catch (e) {
        throw e
    }
}

/**
 * Delete tag by ID
 *
 * @param {string} id Tag ID
 */
export const deleteTag = async (id) => {
    try {
        await Tag.findByIdAndDelete(id)
    } catch (e) {
        throw e
    }
}

/**
 * Get tag by ID
 *
 * @param {string} id Tag ID
 *
 * @returns Tag object
 */
export const getTag = async (id) => {
    try {
        return await Tag.findById(id)
    } catch (e) {
        throw e
    }
}

/**
 * Get all tags
 *
 * @returns List of all Tag objects
 */
export const listTags = async () => {
    try {
        return await Tag.find()
    } catch (e) {
        throw e
    }
}
