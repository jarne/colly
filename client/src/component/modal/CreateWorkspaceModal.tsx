/**
 * Colly | workspace create view component
 */

import {
    forwardRef,
    useImperativeHandle,
    useState,
    type ChangeEvent,
    type MouseEvent,
    type SubmitEvent,
} from "react"
import Modal from "react-bootstrap/Modal"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import type { UserRes } from "./../../logic/api/user"
import {
    createWorkspace,
    deleteWorkspace,
    getUserByUsername,
    updateWorkspace,
    type WorkspaceMember,
} from "./../../logic/api/workspace"
import { useAppData } from "./../context/DataProvider"
import { useUserAuth } from "./../context/UserAuthProvider"

type CreateWorkspaceModalHandle = {
    open: () => void
    setEditId: (id: string) => void
}

type CreateWorkspaceModalProps = object

const CreateWorkspaceModal = forwardRef<
    CreateWorkspaceModalHandle,
    CreateWorkspaceModalProps
>(function CreateWorkspaceModal(_props, ref) {
    const DEFAULT_EMPTY = ""
    const DEFAULT_PERM_LEVEL = "read"

    const navigate = useNavigate()
    const { t } = useTranslation()
    const { accessToken, userId, displayName } = useUserAuth()
    const { workspaces, loadWorkspaces } = useAppData()

    const DEFAULT_MEMBERS = [
        {
            user: {
                _id: userId,
                username: displayName,
            },
            permissionLevel: "admin",
        },
    ]

    const [show, setShow] = useState(false)

    const [editId, setEditId] = useState<string | null>(null)

    const [wsName, setWsName] = useState(DEFAULT_EMPTY)
    const [members, setMembers] = useState<WorkspaceMember[]>(DEFAULT_MEMBERS)

    const [addUsername, setAddUsername] = useState(DEFAULT_EMPTY)
    const [addPerm, setAddPerm] = useState(DEFAULT_PERM_LEVEL)

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
        setWsName(DEFAULT_EMPTY)
        setMembers(DEFAULT_MEMBERS)
        setAddUsername(DEFAULT_EMPTY)
        setAddPerm(DEFAULT_PERM_LEVEL)
    }
    const loadEditInput = (id: string) => {
        for (const ws of workspaces) {
            if (ws._id === id) {
                setWsName(ws.name)
                setMembers(ws.members as WorkspaceMember[])
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

    const handleWsNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setWsName(e.target.value)
    }
    const handleMemberPermLevelChange = (
        e: ChangeEvent<HTMLSelectElement>,
        uid: string
    ) => {
        const changedMembers = members.map((member) => {
            if (member.user._id === uid) {
                return {
                    ...member,
                    permissionLevel: e.target.value,
                }
            }

            return member
        })
        setMembers(changedMembers)
    }
    const handleAddUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddUsername(e.target.value)
    }
    const handleAddPermChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setAddPerm(e.target.value)
    }

    const handleMemberRemoveClick = (uid: string) => {
        const changedMembers = members.filter((member) => {
            return member.user._id !== uid
        })
        setMembers(changedMembers)
    }
    const handleMemberAddClick = async () => {
        if (addUsername === "") {
            toast.error(t("modal.workspace.errors.emptyUsername"))
            return
        }

        const duplicate = members.some((member) => {
            return member.user.username === addUsername
        })
        if (duplicate) {
            toast.error(t("modal.workspace.errors.duplicateMember"))
            return
        }

        let userData: UserRes
        try {
            userData = await getUserByUsername(addUsername, accessToken)
        } catch (ex) {
            if (ex instanceof Error) toast.error(ex.message)
            return
        }

        const newMember = {
            user: {
                _id: (userData as UserRes)._id,
                username: addUsername,
            },
            permissionLevel: addPerm,
        }
        setMembers([...members, newMember])

        setAddUsername(DEFAULT_EMPTY)
        setAddPerm(DEFAULT_PERM_LEVEL)
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        let createdId: string | undefined
        try {
            if (editId) {
                await updateWorkspace(
                    editId,
                    {
                        name: wsName,
                        members,
                    },
                    accessToken
                )
            } else {
                createdId = await createWorkspace(
                    {
                        name: wsName,
                        members,
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
                ? t("modal.workspace.updated")
                : t("modal.workspace.created", { name: wsName })
        )
        handleClose()

        loadWorkspaces({
            populate: {
                path: "members.user",
                select: "username",
            },
        })

        if (createdId) {
            navigate(`/workspace/${createdId}`)
        }
    }
    const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (editId === null) {
            return
        }

        try {
            await deleteWorkspace(editId, accessToken)
        } catch (ex) {
            if (ex instanceof Error) toast.error(ex.message)
            return
        }

        toast.success(t("modal.workspace.deleted"))
        handleClose()

        loadWorkspaces({
            populate: {
                path: "members.user",
                select: "username",
            },
        })
        navigate("/")
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="createWorkspaceModalLabel">
                    {editId
                        ? t("modal.workspace.editTitle")
                        : t("modal.workspace.createTitle")}
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
                        <label htmlFor="wsNameInput" className="form-label">
                            {t("modal.workspace.nameLabel")}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="wsNameInput"
                            placeholder={t("modal.workspace.namePlaceholder")}
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
                            {t("modal.workspace.membersLabel")}
                        </label>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        {t("modal.workspace.table.user")}
                                    </th>
                                    <th scope="col">
                                        {t(
                                            "modal.workspace.table.permissionLevel"
                                        )}
                                    </th>
                                    <th scope="col">
                                        {t("modal.workspace.table.action")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member) => (
                                    <tr key={member.user._id}>
                                        <th scope="row">
                                            {member.user.username}
                                        </th>
                                        <td>
                                            <select
                                                className="form-select"
                                                aria-label={t(
                                                    "modal.workspace.permissionSelect"
                                                )}
                                                value={member.permissionLevel}
                                                onChange={(e) => {
                                                    handleMemberPermLevelChange(
                                                        e,
                                                        member.user._id
                                                    )
                                                }}
                                            >
                                                <option value="read">
                                                    {t(
                                                        "modal.workspace.permission.read"
                                                    )}
                                                </option>
                                                <option value="write">
                                                    {t(
                                                        "modal.workspace.permission.write"
                                                    )}
                                                </option>
                                                <option value="admin">
                                                    {t(
                                                        "modal.workspace.permission.admin"
                                                    )}
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-link"
                                                onClick={() => {
                                                    handleMemberRemoveClick(
                                                        member.user._id
                                                    )
                                                }}
                                            >
                                                {t(
                                                    "modal.workspace.removeButton"
                                                )}
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
                                            onChange={handleAddUsernameChange}
                                            placeholder={t(
                                                "modal.workspace.usernamePlaceholder"
                                            )}
                                            aria-label={t(
                                                "modal.workspace.newUserUsername"
                                            )}
                                        />
                                    </th>
                                    <td>
                                        <select
                                            className="form-select"
                                            aria-label={t(
                                                "modal.workspace.permissionSelect"
                                            )}
                                            value={addPerm}
                                            onChange={handleAddPermChange}
                                        >
                                            <option value="read">
                                                {t(
                                                    "modal.workspace.permission.read"
                                                )}
                                            </option>
                                            <option value="write">
                                                {t(
                                                    "modal.workspace.permission.write"
                                                )}
                                            </option>
                                            <option value="admin">
                                                {t(
                                                    "modal.workspace.permission.admin"
                                                )}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            onClick={handleMemberAddClick}
                                        >
                                            {t("common.add")}
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
                            {t("common.delete")}
                        </button>
                    )}
                    <div>
                        <button
                            type="button"
                            className="btn btn-light me-2"
                            onClick={handleClose}
                        >
                            {t("common.cancel")}
                        </button>
                        <button type="submit" className="btn btn-secondary">
                            {editId ? t("common.edit") : t("common.create")}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    )
})

export default CreateWorkspaceModal
