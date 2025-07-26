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
            ]}
            {...props}
        />
    )
}

const useCurrentInput = () => useContext(CurrentInputContext)

export { CurrentInputProvider, useCurrentInput }
