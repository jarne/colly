/**
 * Colly | Passport.js strategies
 */

import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import mongoose from "mongoose"

const User = mongoose.model("User")

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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
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
