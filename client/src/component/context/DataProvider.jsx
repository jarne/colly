/**
 * Colly | app data provider
 */

import { createContext, useContext, useState } from "react"

import { useUserAuth } from "./UserAuthProvider"
import { findTags } from "./../../logic/api/tag"
import { findItems } from "./../../logic/api/item"
import { findUsers } from "./../../logic/api/user"

const AppDataContext = createContext(null)

const AppDataProvider = (props) => {
    const [tags, setTags] = useState([])
    const [items, setItems] = useState([])
    const [users, setUsers] = useState([])

    const [accessToken] = useUserAuth()

    const loadTags = async (query) => {
        let tags
        try {
            tags = await findTags(accessToken, query)
        } catch {
            return
        }

        setTags(tags)
    }

    const loadItems = async (query) => {
        let items
        try {
            items = await findItems(accessToken, query)
        } catch (e) {
            if (e.message === "unauthorized") {
                throw e
            }

            return
        }

        setItems(items)
    }

    const loadUsers = async (query) => {
        let users
        try {
            users = await findUsers(accessToken, query)
        } catch (e) {
            if (e.message === "unauthorized") {
                throw e
            }

            return
        }

        setUsers(users)
    }

    return (
        <AppDataContext.Provider
            value={[
                tags,
                setTags,
                loadTags,
                items,
                setItems,
                loadItems,
                users,
                setUsers,
                loadUsers,
            ]}
            {...props}
        />
    )
}

const useAppData = () => useContext(AppDataContext)

export { AppDataProvider, useAppData }
