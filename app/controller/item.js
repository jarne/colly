/**
 * Colly | item controller
 */

import Item from "./../model/item.js"
import crudController from "./../controller/common/crud.js"
import logger from "./../util/logger.js"

const crud = crudController(Item)

/**
 * List items
 * @returns All items
 */
export const list = async () => {
    try {
        return await Item.find().populate("tags")
    } catch (e) {
        logger.error("item_list_error", {
            error: e.message,
        })

        throw e
    }
}

/**
 * Check if user has permission to access an item
 *
 * @param {string} itemId Item ID
 * @param {string} userId User ID
 *
 * @returns access allowed (bool)
 */
const hasPermission = async (itemId, userId) => {
    let item
    try {
        item = await Item.findById(itemId)
    } catch (e) {
        logger.error("item_get_error", {
            id: itemId,
            error: e.message,
        })

        throw e
    }

    return item.owner.toString() === userId
}

export default {
    create: crud.create,
    update: crud.update,
    del: crud.del,
    getById: crud.getById,
    list,
    hasPermission,
}
