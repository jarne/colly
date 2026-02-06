/**
 * Colly | user auth info provider
 */

import { createContext, useContext, useState } from "react"

type UserAuthContextType = {
    accessToken: string
    setAccessToken: (accessToken: string) => void
    userId: string
    setUserId: (userId: string) => void
    displayName: string
    setDisplayName: (displayName: string) => void
    isAdmin: boolean
    setIsAdmin: (isAdmin: boolean) => void
}

const UserAuthContext = createContext<UserAuthContextType | null>(null)

const UserAuthProvider = (props: object) => {
    const [accessToken, setAccessToken] = useState("")
    const [userId, setUserId] = useState("")
    const [displayName, setDisplayName] = useState("...")
    const [isAdmin, setIsAdmin] = useState(false)

    return (
        <UserAuthContext.Provider
            value={{
                accessToken,
                setAccessToken,
                userId,
                setUserId,
                displayName,
                setDisplayName,
                isAdmin,
                setIsAdmin,
            }}
            {...props}
        />
    )
}

function useUserAuth(): UserAuthContextType {
    const ctx = useContext(UserAuthContext)

    if (!ctx) {
        throw new Error("useUserAuth must be used within UserAuthProvider")
    }

    return ctx
}

export { UserAuthProvider, useUserAuth }
