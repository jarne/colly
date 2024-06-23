/**
 * Colly | user create view component
 */

import { useState, useImperativeHandle, forwardRef } from "react"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

import { useUserAuth } from "./../../context/UserAuthProvider"
import { useAppData } from "./../../context/DataProvider"
import { createUser, updateUser } from "./../../../logic/api/user"

import "./CreateUserModal.css"

const CreateUserModal = forwardRef((props, ref) => {
    const DEFAULT_EMPTY = ""
    const DEFAULT_FALSE = false

    const [accessToken] = useUserAuth()
    const [, , , , , , users, , loadUsers] = useAppData()

    const [show, setShow] = useState(false)

    const [editId, setEditId] = useState(null)

    const [username, setUsername] = useState(DEFAULT_EMPTY)
    const [password, setPassword] = useState(DEFAULT_EMPTY)
    const [isAdmin, setIsAdmin] = useState(DEFAULT_FALSE)

    useImperativeHandle(ref, () => ({
        open() {
            handleShow()
        },
        setEditId(id) {
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

    const loadEditInput = (id) => {
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

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleIsAdminChange = (e) => {
        setIsAdmin(e.target.checked)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            editId
                ? await updateUser(
                      editId,
                      username,
                      password,
                      isAdmin,
                      accessToken
                  )
                : await createUser(username, password, isAdmin, accessToken)
        } catch (ex) {
            toast.error(ex.message)

            return
        }

        toast.success(
            editId
                ? "User has been updated!"
                : `User "${username}" has been created!`
        )
        handleClose()

        loadUsers()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="createUserModalLabel">
                    {editId ? `Edit user` : "Create new user"}
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleClose}
                ></button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="modal-body">
                    <div className="mb-3">
                        <label htmlFor="userNameInput" className="form-label">
                            User name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="userNameInput"
                            placeholder="user123"
                            value={username}
                            onChange={handleUsernameChange}
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label">
                            Temporary password
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
                            value={isAdmin}
                            onChange={handleIsAdminChange}
                        />
                        <label
                            htmlFor="isAdminInput"
                            className="form-check-label"
                        >
                            Admin user
                        </label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-theme-light"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-theme-pink">
                        {editId ? "Edit" : "Create"}
                    </button>
                </div>
            </form>
        </Modal>
    )
})

export default CreateUserModal
