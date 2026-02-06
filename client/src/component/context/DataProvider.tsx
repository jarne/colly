/**
 * Colly | app data provider
 */

import { createContext, useContext, useState } from "react"

import { findItems, type ItemRes } from "./../../logic/api/item"
import { findTags, type TagRes } from "./../../logic/api/tag"
import { findUsers, type UserRes } from "./../../logic/api/user"
import { findWorkspaces, type WorkspaceRes } from "./../../logic/api/workspace"
import { useCurrentInput } from "./CurrentInputProvider"
import { useUserAuth } from "./UserAuthProvider"

type AppDataContextType = {
    workspaces: WorkspaceRes[]
    setWorkspaces: (workspaces: WorkspaceRes[]) => void
    loadWorkspaces: (query: object) => Promise<WorkspaceRes[] | undefined>
    tags: TagRes[]
    setTags: (tags: TagRes[]) => void
    loadTags: (query: object) => Promise<TagRes[] | undefined>
    items: ItemRes[]
    setItems: (items: ItemRes[]) => void
    loadItems: (query: object) => Promise<ItemRes[] | undefined>
    users: UserRes[]
    setUsers: (users: UserRes[]) => void
    loadUsers: (query: object) => Promise<UserRes[] | undefined>
}

const AppDataContext = createContext<AppDataContextType | null>(null)

const AppDataProvider = (props: object) => {
    const [workspaces, setWorkspaces] = useState<WorkspaceRes[]>([])
    const [tags, setTags] = useState<TagRes[]>([])
    const [items, setItems] = useState<ItemRes[]>([])
    const [users, setUsers] = useState<UserRes[]>([])

    const { accessToken } = useUserAuth()
    const { workspace } = useCurrentInput()

    const loadWorkspaces = async (query: object) => {
        let workspaces
        try {
            workspaces = await findWorkspaces(query, accessToken)
        } catch (e) {
            if (e instanceof Error && e.message === "unauthorized") {
                throw e
            }

            return
        }

        setWorkspaces(workspaces)
        return workspaces
    }

    const loadTags = async (query: object) => {
        let tags
        try {
            tags = await findTags(query, workspace, accessToken)
        } catch (e) {
            if (e instanceof Error && e.message === "unauthorized") {
                throw e
            }

            return
        }

        setTags(tags)
        return tags
    }

    const loadItems = async (query: object) => {
        let items
        try {
            items = await findItems(query, workspace, accessToken)
        } catch (e) {
            if (e instanceof Error && e.message === "unauthorized") {
                throw e
            }

            return
        }

        setItems(items)
        return items
    }

    const loadUsers = async (query: object) => {
        let users
        try {
            users = await findUsers(query, accessToken)
        } catch (e) {
            if (e instanceof Error && e.message === "unauthorized") {
                throw e
            }

            return
        }

        setUsers(users)
        return users
    }

    return (
        <AppDataContext.Provider
            value={{
                workspaces,
                setWorkspaces,
                loadWorkspaces,
                tags,
                setTags,
                loadTags,
                items,
                setItems,
                loadItems,
                users,
                setUsers,
                loadUsers,
            }}
            {...props}
        />
    )
}

function useAppData(): AppDataContextType {
    const ctx = useContext(AppDataContext)

    if (!ctx) {
        throw new Error("useAppData must be used within AppDataProvider")
    }

    return ctx
}

export { AppDataProvider, useAppData }
