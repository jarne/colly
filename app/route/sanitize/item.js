/**
 * Colly | item query sanitization
 */

import * as z from "zod"

const filterSchema = z.object({
    url: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    tags: z.string().optional(),
})

const populateSchema = z.object({}).optional()

const sortSchema = z.string().optional()

const selectSchema = z.string().optional()

const limitSchema = z.number().optional()

export default {
    filterSchema,
    populateSchema,
    sortSchema,
    selectSchema,
    limitSchema,
}
