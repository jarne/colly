/**
 * Colly | user create view component
 */

import {
    useState,
    useImperativeHandle,
    forwardRef,
    type ChangeEvent,
    type SubmitEvent,
} from "react"
import Modal from "react-bootstrap/Modal"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

import { useUserAuth } from "./../../context/UserAuthProvider"
import { useAppData } from "./../../context/DataProvider"
import { createUser, updateUser } from "./../../../logic/api/user"

type CreateUserModalHandle = {
    open: () => void
    setEditId: (id: string) => void
}

type CreateUserModalProps = object

const CreateUserModal = forwardRef<CreateUserModalHandle, CreateUserModalProps>(
    function CreateUserModal(_props, ref) {
        const DEFAULT_EMPTY = ""
        const DEFAULT_FALSE = false

        const { t } = useTranslation()
        const { accessToken } = useUserAuth()
        const { users, loadUsers } = useAppData()

        const [show, setShow] = useState(false)

        const [editId, setEditId] = useState<string | null>(null)

        const [username, setUsername] = useState(DEFAULT_EMPTY)
        const [password, setPassword] = useState(DEFAULT_EMPTY)
        const [isAdmin, setIsAdmin] = useState(DEFAULT_FALSE)

        useImperativeHandle(ref, () => ({
            open() {
                handleShow()
            },
            setEditId(id: string) {
                setEditId(id)
                loadEditInput(id)
            },
        }))

        const resetInput = () => {
            setEditId(null)
            setUsername(DEFAULT_EMPTY)
            setPassword(DEFAULT_EMPTY)
            setIsAdmin(DEFAULT_FALSE)
        }

        const loadEditInput = (id: string) => {
            for (const user of users) {
                if (user._id === id) {
                    setUsername(user.username)
                    setIsAdmin(user.isAdmin)
                }
            }
        }

        const handleShow = () => {
            setShow(true)
        }

        const handleClose = () => {
            setShow(false)

            resetInput()
        }

        const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value)
        }
        const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
        }
        const handleIsAdminChange = (e: ChangeEvent<HTMLInputElement>) => {
            setIsAdmin(e.target.checked)
        }

        const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault()

            try {
                if (editId) {
                    await updateUser(
                        editId,
                        {
                            username: username,
                            password: password,
                            isAdmin: isAdmin,
                        },
                        accessToken
                    )
                } else {
                    await createUser(
                        {
                            username: username,
                            password: password,
                            isAdmin: isAdmin,
                        },
                        accessToken
                    )
                }
            } catch (ex) {
                if (ex instanceof Error) toast.error(ex.message)

                return
            }

            toast.success(
                editId
                    ? t("modal.admin.user.updated")
                    : t("modal.admin.user.created", { username })
            )
            handleClose()

            loadUsers()
        }

        return (
            <Modal show={show} onHide={handleClose}>
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="createUserModalLabel">
                        {editId
                            ? t("modal.admin.user.editTitle")
                            : t("modal.admin.user.createTitle")}
                    </h1>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label={t("common.close")}
                        onClick={handleClose}
                    ></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label
                                htmlFor="userNameInput"
                                className="form-label"
                            >
                                {t("modal.admin.user.usernameLabel")}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="userNameInput"
                                placeholder={t(
                                    "modal.admin.user.usernamePlaceholder"
                                )}
                                value={username}
                                onChange={handleUsernameChange}
                                autoFocus
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="passwordInput"
                                className="form-label"
                            >
                                {t("modal.admin.user.passwordLabel")}
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isAdminInput"
                                checked={isAdmin}
                                onChange={handleIsAdminChange}
                            />
                            <label
                                htmlFor="isAdminInput"
                                className="form-check-label"
                            >
                                {t("modal.admin.user.adminCheckbox")}
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={handleClose}
                        >
                            {t("common.cancel")}
                        </button>
                        <button type="submit" className="btn btn-secondary">
                            {editId ? t("common.edit") : t("common.create")}
                        </button>
                    </div>
                </form>
            </Modal>
        )
    }
)

export default CreateUserModal
