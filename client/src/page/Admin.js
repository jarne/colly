/**
 * Colly | admin panel
 */

import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import Navbar from "./../component/Navbar"
import CreateUserModal from "./../component/modal/admin/CreateUserModal"

import { useUserAuth } from "./../component/context/UserAuthProvider"
import { useAppData } from "./../component/context/DataProvider"
import { deleteUser } from "./../logic/api/user"

function Admin() {
    const navigate = useNavigate()

    const [accessToken] = useUserAuth()
    const [, , , , , , users, , loadUsers] = useAppData()

    const createUserModalRef = useRef()

    const handleCreateUser = (e) => {
        e.preventDefault()

        createUserModalRef.current.open()
    }
    const handleEditUser = (e, userId) => {
        e.preventDefault()

        createUserModalRef.current.setEditId(userId)
        createUserModalRef.current.open()
    }
    const handleDeleteUser = async (e, userId) => {
        e.preventDefault()

        try {
            await deleteUser(userId, accessToken)
        } catch (ex) {
            toast.error(ex.message)

            return
        }

        toast.success(`User has been deleted!`)
        loadUsers()
    }

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
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user._id}>
                                    <th scope="row">{user.username}</th>
                                    <td>
                                        {user.isAdmin ? (
                                            <i className="bi bi-check"></i>
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                    <td>
                                        <div
                                            className="btn-group"
                                            role="group"
                                            aria-label="User actions"
                                        >
                                            <button
                                                className="btn btn-theme-orange btn-sm"
                                                onClick={(e) => {
                                                    handleEditUser(e, user._id)
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-theme-pink btn-sm"
                                                onClick={(e) => {
                                                    handleDeleteUser(
                                                        e,
                                                        user._id
                                                    )
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
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
