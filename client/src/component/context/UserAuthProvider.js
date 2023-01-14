/**
 * Colly | access token provider
 */

import { createContext, useContext, useState } from "react"

const UserAuthContext = createContext(null)

const UserAuthProvider = (props) => {
    const [accessToken, setAccessToken] = useState(null)
    const [displayName, setDisplayName] = useState("...")

    return (
        <UserAuthContext.Provider
            value={[accessToken, setAccessToken, displayName, setDisplayName]}
            {...props}
        />
    )
}

const useUserAuth = () => useContext(UserAuthContext)

export { UserAuthProvider, useUserAuth }
