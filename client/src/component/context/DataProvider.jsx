/**
 * Colly | app data provider
 */

import { createContext, useContext, useState } from "react"

import { useUserAuth } from "./UserAuthProvider"
import { useCurrentInput } from "./CurrentInputProvider"
import { findWorkspaces } from "./../../logic/api/workspace"
import { findTags } from "./../../logic/api/tag"
import { findItems } from "./../../logic/api/item"
import { findUsers } from "./../../logic/api/user"

const AppDataContext = createContext(null)

const AppDataProvider = (props) => {
    const [workspaces, setWorkspaces] = useState([])
    const [tags, setTags] = useState([])
    const [items, setItems] = useState([])
    const [users, setUsers] = useState([])

    const { accessToken } = useUserAuth()
    const { workspace } = useCurrentInput()

    const loadWorkspaces = async (query) => {
        let workspaces
        try {
            workspaces = await findWorkspaces(query, accessToken)
        } catch (e) {
            if (e.message === "unauthorized") {
                throw e
            }

            return
        }

        setWorkspaces(workspaces)
        return workspaces
    }

    const loadTags = async (query) => {
        let tags
        try {
            tags = await findTags(query, workspace, accessToken)
        } catch (e) {
            if (e.message === "unauthorized") {
                throw e
            }

            return
        }

        setTags(tags)
        return tags
    }

    const loadItems = async (query) => {
        let items
        try {
            items = await findItems(query, workspace, accessToken)
        } catch (e) {
            if (e.message === "unauthorized") {
                throw e
            }

            return
        }

        setItems(items)
        return items
    }

    const loadUsers = async (query) => {
        let users
        try {
            users = await findUsers(query, accessToken)
        } catch (e) {
            if (e.message === "unauthorized") {
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

const useAppData = () => useContext(AppDataContext)

export { AppDataProvider, useAppData }
