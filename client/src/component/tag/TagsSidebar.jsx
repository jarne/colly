/**
 * Colly | tags sidebar component
 */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import usePrefersColorScheme from "use-prefers-color-scheme"

import { useAppData } from "./../context/DataProvider"

import "./TagsSidebar.css"

function TagsSidebar(props) {
    const navigate = useNavigate()

    const prefersColorScheme = usePrefersColorScheme()
    const isDarkMode = prefersColorScheme === "dark"

    const [tags, , loadTags] = useAppData()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isEditMode, setEditMode] = useState(false)

    useEffect(() => {
        loadTags()
    }, [])

    const handleCollapsedChange = (e) => {
        setIsCollapsed(!isCollapsed)
    }

    const handleEditModeChange = (e) => {
        setEditMode(!isEditMode)
    }

    const handleTagClick = (e, tagId) => {
        e.preventDefault()

        if (isEditMode) {
            props.createTagModalRef.current.setEditId(tagId)
            props.createTagModalRef.current.open()

            return
        }

        navigate(`/tag/${tagId}`)
    }

    return (
        <div
            className={`tags-sidebar ${isCollapsed ? "" : "tags-sidebar-expanded"} d-flex flex-column ${isDarkMode ? "bg-dark" : "bg-light"} p-3`}
        >
            {tags.map((tag) => {
                return (
                    <div
                        key={tag._id}
                        className={`tags-sidebar-tag text-decoration-none${props.activeTag === tag._id ? " fw-bold" : ""}`}
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
            {!isCollapsed && (
                <div className="form-check tags-edit-mode-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="editModeCheck"
                        checked={isEditMode}
                        onChange={handleEditModeChange}
                    />
                    <label className="form-check-label" htmlFor="editModeCheck">
                        Edit mode
                    </label>
                </div>
            )}
            <div className="mt-auto text-end">
                <button
                    onClick={handleCollapsedChange}
                    className="bg-transparent border-0"
                >
                    <i
                        class={`bi bi-chevron-${isCollapsed ? "right" : "left"} fs-5`}
                    ></i>
                </button>
            </div>
        </div>
    )
}

export default TagsSidebar
