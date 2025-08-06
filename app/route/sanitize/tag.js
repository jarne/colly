/**
 * Colly | tag query sanitization
 */

import * as z from "zod"

const filterSchema = z
    .object({
        name: z
            .union([
                z.string(),
                z.object({
                    $regex: z.string(),
                }),
            ])
            .optional(),
    })
    .optional()

const populateSchema = z.object({}).optional()

const sortSchema = z
    .union([
        z.string(),
        z.record(z.enum(["lastUsed"]), z.enum(["asc", "desc"])),
    ])
    .optional()

const selectSchema = z.string().optional()

const limitSchema = z.number().optional()

export default {
    filterSchema,
    populateSchema,
    sortSchema,
    selectSchema,
    limitSchema,
}
