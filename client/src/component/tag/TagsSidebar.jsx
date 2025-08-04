/**
 * Colly | tags sidebar component
 */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import usePrefersColorScheme from "use-prefers-color-scheme"

import { useAppData } from "./../context/DataProvider"
import { useCurrentInput } from "./../context/CurrentInputProvider"

import "./TagsSidebar.css"

function TagsSidebar(props) {
    const navigate = useNavigate()

    const prefersColorScheme = usePrefersColorScheme()
    const isDarkMode = prefersColorScheme === "dark"

    const { workspaces, loadWorkspaces, tags, loadTags } = useAppData()
    const { workspace, isEditMode, setEditMode } = useCurrentInput()

    const isMobile = window.innerWidth < 768

    const [isCollapsed, setIsCollapsed] = useState(isMobile)

    const triggerDataLoad = async () => {
        try {
            await loadWorkspaces({
                populate: "members.user",
            })
            if (workspace) {
                await loadTags()
            }
        } catch {
            navigate("/login")
        }
    }

    useEffect(() => {
        triggerDataLoad()
    }, [workspace])

    const handlWorkspaceChange = (e) => {
        navigate(`/workspace/${e.target.value}`)
    }
    const handleEditModeChange = () => {
        setEditMode(!isEditMode)
    }
    const handleCollapsedChange = () => {
        setIsCollapsed(!isCollapsed)
    }

    const handleTagClick = (e, tagId) => {
        e.preventDefault()

        if (isEditMode) {
            props.createTagModalRef.current.setEditId(tagId)
            props.createTagModalRef.current.open()

            return
        }

        navigate(`/workspace/${workspace}/tag/${tagId}`)
    }
    const handleWorkspaceClick = (e) => {
        if (!isEditMode) {
            return
        }

        e.preventDefault()

        props.createWorkspaceModalRef.current.setEditId(workspace)
        props.createWorkspaceModalRef.current.open()
    }

    return (
        <div
            id="tagsSidebar"
            className={`tags-sidebar${isCollapsed ? "" : " tags-sidebar-expanded"} d-flex flex-column ${isDarkMode ? "bg-dark" : "bg-light"} p-3`}
        >
            <div className="mb-2">
                {tags.map((tag) => {
                    return (
                        <div
                            key={tag._id}
                            className={`tags-sidebar-tag text-decoration-none${props.activeTag === tag._id ? " tags-sidebar-tag-active fw-bold" : ""}`}
                            role="button"
                            onClick={(e) => {
                                handleTagClick(e, tag._id)
                            }}
                        >
                            <div
                                className="tags-sidebar-col-circle"
                                style={{
                                    background: `linear-gradient(to bottom right, #${tag.firstColor}, #${tag.secondColor})`,
                                }}
                            ></div>
                            {!isCollapsed && tag.name}
                        </div>
                    )
                })}
            </div>
            <div className="mt-auto">
                {!isCollapsed && (
                    <>
                        <div className="mb-1">
                            <select
                                className="form-select"
                                aria-label="Select workspace"
                                value={workspace}
                                onChange={handlWorkspaceChange}
                                onClick={handleWorkspaceClick}
                            >
                                {workspaces.map((workspace) => (
                                    <option
                                        key={workspace._id}
                                        value={workspace._id}
                                    >
                                        {workspace.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-check tags-edit-mode-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="editModeCheck"
                                checked={isEditMode}
                                onChange={handleEditModeChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="editModeCheck"
                            >
                                Edit mode
                            </label>
                        </div>
                    </>
                )}
                <div className="text-end">
                    <button
                        onClick={handleCollapsedChange}
                        aria-label={
                            isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                        aria-expanded={!isCollapsed}
                        aria-controls="tagsSidebar"
                        className="bg-transparent border-0"
                    >
                        <i
                            className={`bi bi-chevron-${isCollapsed ? "right" : "left"} fs-5`}
                            aria-hidden="true"
                        ></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TagsSidebar
