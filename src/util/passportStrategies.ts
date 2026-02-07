/**
 * Colly | Passport.js strategies
 */

import type { Request } from "express"
import mongoose from "mongoose"
import passport from "passport"
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt"
import { Strategy as LocalStrategy } from "passport-local"

const User = mongoose.model("User")

const getJwt = (req: Request) => {
    return req.cookies.token || ExtractJwt.fromAuthHeaderAsBearerToken()(req)
}

passport.use(
    new LocalStrategy(async (username, password, done) => {
        let user
        try {
            user = await User.findOne({
                username: username,
            })
        } catch (e) {
            return done(e)
        }

        if (!user) {
            return done(null, false)
        }

        const passwordCheck = await user.checkPassword(password)

        if (!passwordCheck) {
            return done(null, false)
        }

        return done(null, user)
    })
)

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: getJwt,
            secretOrKey: process.env.JWT_SECRET!,
        },
        (jwtPayload, done) => {
            if (jwtPayload.id) {
                return done(null, jwtPayload)
            } else {
                return done(null, false)
            }
        }
    )
)

passport.use(
    "jwt_admin",
    new JwtStrategy(
        {
            jwtFromRequest: getJwt,
            secretOrKey: process.env.JWT_SECRET!,
        },
        async (jwtPayload, done) => {
            let user
            try {
                user = await User.findById(jwtPayload.id)
            } catch (e) {
                return done(e)
            }

            if (!user) {
                return done(null, false)
            }

            if (!user.isAdmin) {
                return done(null, false)
            }

            return done(null, user)
        }
    )
)
