/**
 * Colly | admin panel
 */

import { useEffect, useRef, type MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { useAppData } from "./../component/context/DataProvider"
import { useUserAuth } from "./../component/context/UserAuthProvider"
import CreateUserModal from "./../component/modal/admin/CreateUserModal"
import Navbar from "./../component/nav/Navbar"
import { deleteUser } from "./../logic/api/user"

type CreateUserModalHandle = {
    open: () => void
    setEditId: (id: string) => void
}

function Admin() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { accessToken } = useUserAuth()
    const { users, loadUsers } = useAppData()

    const createUserModalRef = useRef<CreateUserModalHandle | null>(null)

    const handleCreateUser = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        createUserModalRef.current?.open()
    }
    const handleEditUser = (
        e: MouseEvent<HTMLButtonElement>,
        userId: string
    ) => {
        e.preventDefault()

        createUserModalRef.current?.setEditId(userId)
        createUserModalRef.current?.open()
    }
    const handleDeleteUser = async (
        e: MouseEvent<HTMLButtonElement>,
        userId: string
    ) => {
        e.preventDefault()

        try {
            await deleteUser(userId, accessToken)
        } catch (ex) {
            if (ex instanceof Error) toast.error(ex.message)

            return
        }

        toast.success(t("admin.deleted"))
        loadUsers()
    }

    const triggerUserLoad = async (): Promise<void> => {
        try {
            await loadUsers()
        } catch {
            navigate("/login")
        }
    }

    useEffect(() => {
        triggerUserLoad()
    }, [accessToken])

    return (
        <>
            <Navbar />
            <main className="container mt-3">
                <h2>{t("admin.title")}</h2>
                <p>
                    <button
                        className="btn btn-secondary"
                        onClick={handleCreateUser}
                    >
                        {t("admin.createUser")}
                    </button>
                </p>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">{t("admin.table.username")}</th>
                            <th scope="col">{t("admin.table.admin")}</th>
                            <th scope="col">{t("admin.table.action")}</th>
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
                                            aria-label={t("admin.userActions")}
                                        >
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={(e) => {
                                                    handleEditUser(e, user._id)
                                                }}
                                            >
                                                {t("common.edit")}
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={(e) => {
                                                    handleDeleteUser(
                                                        e,
                                                        user._id
                                                    )
                                                }}
                                            >
                                                {t("common.delete")}
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
