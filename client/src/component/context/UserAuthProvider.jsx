/**
 * Colly | user auth info provider
 */

import { createContext, useContext, useState } from "react"

const UserAuthContext = createContext(null)

const UserAuthProvider = (props) => {
    const [accessToken, setAccessToken] = useState(null)
    const [displayName, setDisplayName] = useState("...")
    const [isAdmin, setIsAdmin] = useState(false)

    return (
        <UserAuthContext.Provider
            value={{
                accessToken,
                setAccessToken,
                displayName,
                setDisplayName,
                isAdmin,
                setIsAdmin,
            }}
            {...props}
        />
    )
}

const useUserAuth = () => useContext(UserAuthContext)

export { UserAuthProvider, useUserAuth }
