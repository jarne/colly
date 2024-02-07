/**
 * Colly | CRUD router
 */

import { handleError } from "./../../routes.js"

/**
 * Common CRUD routes
 * @param {object} controller Controller for model
 */
const crud = (controller) => {
    /**
     * Create operation
     * @param {object} req Request
     * @param {object} res Result
     */
    const create = async (req, res) => {
        let obj
        try {
            obj = await controller.create(req.body)
        } catch (e) {
            return handleError(e, res)
        }

        return res.json({
            id: obj.id,
        })
    }

    /**
     * Update operation
     * @param {object} req Request
     * @param {object} res Result
     */
    const update = async (req, res) => {
        // ...
    }

    /**
     * Delete operation
     * @param {object} req Request
     * @param {object} res Result
     */
    const del = async (req, res) => {
        const id = req.params.id

        try {
            await controller.del(id)
        } catch (e) {
            return handleError(e, res)
        }

        return res.json({
            id,
        })
    }

    /**
     * Get operation
     * @param {object} req Request
     * @param {object} res Result
     */
    const getById = async (req, res) => {
        // TODO: implement
    }

    /**
     * List operation
     * @param {object} req Request
     * @param {object} res Result
     */
    const list = async (req, res) => {
        let objs
        try {
            objs = await controller.list()
        } catch (e) {
            return handleError(e, res)
        }

        return res.json({
            data: objs,
        })
    }

    return {
        create,
        update,
        del,
        getById,
        list,
    }
}

export default crud
