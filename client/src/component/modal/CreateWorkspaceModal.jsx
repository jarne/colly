/**
 * Colly | workspace create view component
 */

import { useState, useImperativeHandle, forwardRef } from "react"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

import { useUserAuth } from "./../context/UserAuthProvider"
import { useAppData } from "./../context/DataProvider"
import {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getUserByUsername,
} from "./../../logic/api/workspace"

const CreateWorkspaceModal = forwardRef(
    function CreateWorkspaceModal(props, ref) {
        const DEFAULT_EMPTY = ""
        const DEFAULT_EMPTY_ARRAY = []
        const DEFAULT_PERM_LEVEL = "read"

        const { accessToken } = useUserAuth()
        const { workspaces, loadWorkspaces } = useAppData()

        const [show, setShow] = useState(false)

        const [editId, setEditId] = useState(null)

        const [wsName, setWsName] = useState(DEFAULT_EMPTY)
        const [members, setMembers] = useState(DEFAULT_EMPTY_ARRAY)

        const [addUsername, setAddUsername] = useState(DEFAULT_EMPTY)
        const [addPerm, setAddPerm] = useState(DEFAULT_PERM_LEVEL)

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
            setWsName(DEFAULT_EMPTY)
            setMembers(DEFAULT_EMPTY_ARRAY)
            setAddUsername(DEFAULT_EMPTY)
            setAddPerm(DEFAULT_PERM_LEVEL)
        }
        const loadEditInput = (id) => {
            for (const ws of workspaces) {
                if (ws._id === id) {
                    setWsName(ws.name)
                    setMembers(ws.members)
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

        const handleWsNameChange = (e) => {
            setWsName(e.target.value)
        }
        const handleMemberPermLevelChange = (e, memberId) => {
            const changedMembers = members.map((member) => {
                if (member._id === memberId) {
                    member.permissionLevel = e.target.value
                }

                return member
            })
            setMembers(changedMembers)
        }
        const handleAddUsernameChange = (e) => {
            setAddUsername(e.target.value)
        }
        const handleAddPermChange = (e) => {
            setAddPerm(e.target.value)
        }

        const handleMemberRemoveClick = (memberId) => {
            const changedMembers = members.filter((member) => {
                return member._id !== memberId
            })
            setMembers(changedMembers)
        }
        const handleMemberAddClick = async () => {
            const duplicate = members.some((member) => {
                return member.user.username === addUsername
            })
            if (duplicate) {
                toast.error("User is already a member of the workspace!")

                return
            }

            let userData
            try {
                userData = await getUserByUsername(addUsername, accessToken)
            } catch (ex) {
                toast.error(ex.message)

                return
            }

            const newMember = {
                user: {
                    _id: userData._id,
                    username: addUsername,
                },
                permissionLevel: addPerm,
            }
            setMembers([...members, newMember])

            setAddUsername(DEFAULT_EMPTY)
            setAddPerm(DEFAULT_PERM_LEVEL)
        }

        const handleSubmit = async (e) => {
            e.preventDefault()

            try {
                editId
                    ? await updateWorkspace(
                          editId,
                          {
                              name: wsName,
                              members,
                          },
                          accessToken
                      )
                    : await createWorkspace(
                          {
                              name: wsName,
                              members,
                          },
                          accessToken
                      )
            } catch (ex) {
                toast.error(ex.message)

                return
            }

            toast.success(
                editId
                    ? "Workspace has been updated!"
                    : `Workspace "${wsName}" has been created!`
            )
            handleClose()

            loadWorkspaces({
                populate: "members.user",
            })
        }
        const handleDelete = async (e) => {
            e.preventDefault()

            try {
                await deleteWorkspace(editId, accessToken)
            } catch (ex) {
                toast.error(ex.message)

                return
            }

            toast.success("Workspace has been deleted!")
            handleClose()

            loadWorkspaces({
                populate: "members.user",
            })
        }

        return (
            <Modal show={show} onHide={handleClose}>
                <div className="modal-header">
                    <h1
                        className="modal-title fs-5"
                        id="createWorkspaceModalLabel"
                    >
                        {editId ? `Edit workspace` : "Create new workspace"}
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
                            <label htmlFor="wsNameInput" className="form-label">
                                Workspace name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="wsNameInput"
                                placeholder="My workspace"
                                value={wsName}
                                onChange={handleWsNameChange}
                                autoFocus
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="tagColorsSection"
                                className="form-label"
                            >
                                Members
                            </label>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">User</th>
                                        <th scope="col">Permission level</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member._id || member.user_id}>
                                            <th scope="row">
                                                {member.user.username}
                                            </th>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    aria-label="Permission level select"
                                                    value={
                                                        member.permissionLevel
                                                    }
                                                    onChange={(e) => {
                                                        handleMemberPermLevelChange(
                                                            e,
                                                            member._id
                                                        )
                                                    }}
                                                >
                                                    <option value="read">
                                                        Read
                                                    </option>
                                                    <option value="write">
                                                        Write
                                                    </option>
                                                    <option value="admin">
                                                        Admin
                                                    </option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-link"
                                                    onClick={() => {
                                                        handleMemberRemoveClick(
                                                            member._id
                                                        )
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th scope="row">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={addUsername}
                                                onChange={
                                                    handleAddUsernameChange
                                                }
                                                placeholder="Username"
                                                aria-label="New user username"
                                            />
                                        </th>
                                        <td>
                                            <select
                                                className="form-select"
                                                aria-label="Permission level select"
                                                value={addPerm}
                                                onChange={handleAddPermChange}
                                            >
                                                <option value="read">
                                                    Read
                                                </option>
                                                <option value="write">
                                                    Write
                                                </option>
                                                <option value="admin">
                                                    Admin
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-link"
                                                onClick={handleMemberAddClick}
                                            >
                                                Add
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div
                        className={`modal-footer${editId ? " d-flex justify-content-between" : ""}`}
                    >
                        {editId && (
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        )}
                        <div>
                            <button
                                type="button"
                                className="btn btn-light me-2"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-secondary">
                                {editId ? "Edit" : "Create"}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        )
    }
)

export default CreateWorkspaceModal
