/**
 * Colly | current user input provider
 */

import { createContext, useContext, useState } from "react"

const CurrentInputContext = createContext(null)

const CurrentInputProvider = (props) => {
    const [workspace, setWorkspace] = useState()
    const [isEditMode, setEditMode] = useState(false)

    const [selectedTag, setSelectedTag] = useState()
    const [searchStr, setSearchStr] = useState("")
    const [sortValue, setSortValue] = useState("-updatedAt")

    return (
        <CurrentInputContext.Provider
            value={{
                workspace,
                setWorkspace,
                isEditMode,
                setEditMode,
                selectedTag,
                setSelectedTag,
                searchStr,
                setSearchStr,
                sortValue,
                setSortValue,
            }}
            {...props}
        />
    )
}

const useCurrentInput = () => useContext(CurrentInputContext)

export { CurrentInputProvider, useCurrentInput }
