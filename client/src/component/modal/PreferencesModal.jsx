/**
 * Colly | user create view component
 */

import { useState, useImperativeHandle, forwardRef } from "react"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

import { useUserAuth } from "./../context/UserAuthProvider"
import { changePassword } from "./../../logic/api/user"

const PreferencesModal = forwardRef(function PreferencesModal(props, ref) {
    const DEFAULT_EMPTY = ""

    const [accessToken] = useUserAuth()

    const [show, setShow] = useState(false)

    const [existingPassword, setExistingPassword] = useState(DEFAULT_EMPTY)
    const [newPassword, setNewPassword] = useState(DEFAULT_EMPTY)

    useImperativeHandle(ref, () => ({
        open() {
            handleShow()
        },
    }))

    const resetInput = () => {
        setExistingPassword(DEFAULT_EMPTY)
        setNewPassword(DEFAULT_EMPTY)
    }

    const handleShow = () => {
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)

        resetInput()
    }

    const handleExistingPasswordChange = (e) => {
        setExistingPassword(e.target.value)
    }
    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await changePassword(existingPassword, newPassword, accessToken)
        } catch (ex) {
            toast.error(ex.message)

            return
        }

        toast.success("Password has been changed!")
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="preferencesModalLabel">
                    User preferences
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
                        <label
                            htmlFor="existingPasswordInput"
                            className="form-label"
                        >
                            Current password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="existingPasswordInput"
                            value={existingPassword}
                            onChange={handleExistingPasswordChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="newPasswordInput"
                            className="form-label"
                        >
                            New password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="newPasswordInput"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-secondary">
                        Change password
                    </button>
                </div>
            </form>
        </Modal>
    )
})

export default PreferencesModal
