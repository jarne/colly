/**
 * Colly | dashboard page
 */

import { toast } from "react-toastify"

import InternalAPI from "./../util/InternalAPI"
import { useAccessToken } from "./../component/AccessTokenProvider"

import "./Dashboard.css"

function Dashboard() {
    const [accessToken, , displayName] = useAccessToken()

    return (
        <>
            <h1>Servus!</h1>
        </>
    )
}

export default Dashboard
