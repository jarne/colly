/**
 * Colly | admin panel
 */

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import Navbar from "./../component/Navbar"
import CreateUserModal from "./../component/modal/admin/CreateUserModal"

import InternalAPI from "./../util/InternalAPI"
import { useUserAuth } from "./../component/context/UserAuthProvider"
import { useAppData } from "./../component/context/DataProvider"

import "./Admin.css"

function Admin() {
    const navigate = useNavigate()

    const [accessToken] = useUserAuth()
    const [, , , , , , users, , loadUsers] = useAppData()

    const createUserModalRef = useRef()

    const handleCreateUser = (e) => {
        e.preventDefault()

        createUserModalRef.current.open()
    }

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
            <main className="container mt-3">
                <h2>Users</h2>
                <p>
                    <button
                        className="btn btn-theme-pink"
                        onClick={handleCreateUser}
                    >
                        Create user
                    </button>
                </p>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">User name</th>
                            <th scope="col">Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user._id}>
                                    <th scope="row">{user.username}</th>
                                    <td>
                                        {user.isAdmin ? (
                                            <i class="bi bi-check"></i>
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </main>
            <CreateUserModal ref={createUserModalRef} />
        </>
    )
}

export default Admin
