/**
 * Colly | app initial user creation script
 */

import mongoose from "mongoose"
import "dotenv/config"

import { connectDbAsync } from "./app/init.js"
import logger from "./app/util/logger.js"
import controller from "./app/controller/user.js"

const initialUser = process.env.INITIAL_ADMIN_USERNAME
const initialPassword = process.env.INITIAL_ADMIN_PASSWORD

if (initialUser !== undefined || initialPassword !== undefined) {
    logger.info("initial_user_creation_requested", {
        username: initialUser,
    })

    await connectDbAsync()

    await controller.create({
        username: initialUser,
        password: initialPassword,
        isAdmin: true,
    })

    await mongoose.disconnect()
}
