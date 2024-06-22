/**
 * Colly | admin panel
 */

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import Navbar from "./../component/Navbar"

import InternalAPI from "./../util/InternalAPI"
import { useUserAuth } from "./../component/context/UserAuthProvider"
import { useAppData } from "./../component/context/DataProvider"

import "./Admin.css"

function Admin() {
    const navigate = useNavigate()

    const [accessToken] = useUserAuth()
    const [, , , , , , users, , loadUsers] = useAppData()

    // const [username, setUsername] = useState("")
    // const [password, setPassword] = useState("")

    // const handleSubmit = async (e) => {
    //     e.preventDefault()

    //     let res
    //     try {
    //         const resp = await fetch(InternalAPI.API_ENDPOINT + "/auth/login", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 username: username,
    //                 password: password,
    //             }),
    //         })
    //         res = await resp.json()
    //     } catch (e) {
    //         toast.error("Error while communicating with the login server!")

    //         return
    //     }

    //     if (res.error) {
    //         switch (res.error_code) {
    //             case "invalid_credentials":
    //                 toast.error("Invalid username or password!")
    //                 break
    //             default:
    //                 toast.error("Unknown error!")
    //                 break
    //         }

    //         return
    //     }

    //     setAccessToken(res.token)
    //     setDisplayName(res.user.username)

    //     navigate("/")
    // }

    useEffect(() => {
        if (accessToken === null) {
            navigate("/login")

            return
        }

        loadUsers()
    }, [accessToken])

    return (
        <>
            <Navbar />
        </>
    )
}

export default Admin
