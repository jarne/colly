/**
 * Colly | current user input provider
 */

import { createContext, useContext, useState } from "react"

const CurrentInputContext = createContext(null)

const CurrentInputProvider = (props) => {
    const [selectedTag, setSelectedTag] = useState()
    const [searchStr, setSearchStr] = useState("")
    const [sortValue, setSortValue] = useState("-updatedAt")
    const [isEditMode, setEditMode] = useState(false)
    const [workspace, setWorkspace] = useState("688f9772e0aa2f2833ecb10d") // TODO: change to select

    return (
        <CurrentInputContext.Provider
            value={[
                selectedTag,
                setSelectedTag,
                searchStr,
                setSearchStr,
                sortValue,
                setSortValue,
                isEditMode,
                setEditMode,
                workspace,
                setWorkspace,
            ]}
            {...props}
        />
    )
}

const useCurrentInput = () => useContext(CurrentInputContext)

export { CurrentInputProvider, useCurrentInput }
