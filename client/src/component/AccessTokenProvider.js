/**
 * Colly | access token provider
 */

import { createContext, useContext, useState } from "react"

const AccessTokenContext = createContext(null)

const AccessTokenProvider = (props) => {
    const [accessToken, setAccessToken] = useState(null)
    const [displayName, setDisplayName] = useState("...")

    return (
        <AccessTokenContext.Provider
            value={[accessToken, setAccessToken, displayName, setDisplayName]}
            {...props}
        />
    )
}

const useAccessToken = () => useContext(AccessTokenContext)

const withAccessToken = (WrappedComponent) => {
    return (props) => {
        const [accessToken, setAccessToken, displayName, setDisplayName] =
            useAccessToken()

        return (
            <WrappedComponent
                accessToken={accessToken}
                setAccessToken={setAccessToken}
                displayName={displayName}
                setDisplayName={setDisplayName}
                {...props}
            />
        )
    }
}

export { AccessTokenProvider, useAccessToken, withAccessToken }
