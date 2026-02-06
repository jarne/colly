/**
 * Colly | current user input provider
 */

import { createContext, useContext, useState } from "react"

type CurrentInputContextType = {
    workspace: string
    setWorkspace: (workspace: string) => void
    isEditMode: boolean
    setEditMode: (isEditMode: boolean) => void
    selectedTag: string
    setSelectedTag: (selectedTag: string) => void
    searchStr: string
    setSearchStr: (searchStr: string) => void
    sortValue: string
    setSortValue: (sortValue: string) => void
}

const CurrentInputContext = createContext<CurrentInputContextType | null>(null)

const CurrentInputProvider = (props: object) => {
    const [workspace, setWorkspace] = useState("")
    const [isEditMode, setEditMode] = useState(false)

    const [selectedTag, setSelectedTag] = useState("")
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

function useCurrentInput(): CurrentInputContextType {
    const ctx = useContext(CurrentInputContext)

    if (!ctx) {
        throw new Error(
            "useCurrentInput must be used within CurrentInputProvider"
        )
    }

    return ctx
}

export { CurrentInputProvider, useCurrentInput }
