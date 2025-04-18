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

    const isMobile = window.innerWidth < 768

    const [isCollapsed, setIsCollapsed] = useState(isMobile)
    const [isEditMode, setEditMode] = useState(false)

    useEffect(() => {
        loadTags()
    }, [])

    const handleCollapsedChange = () => {
        setIsCollapsed(!isCollapsed)
    }

    const handleEditModeChange = () => {
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
            id="tagsSidebar"
            className={`tags-sidebar${isCollapsed ? "" : " tags-sidebar-expanded"} d-flex flex-column ${isDarkMode ? "bg-dark" : "bg-light"} p-3`}
        >
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
    )
}

export default TagsSidebar
