/**
 * Colly | app data provider
 */

import { createContext, useContext, useState } from "react"

import { useUserAuth } from "./UserAuthProvider"
import { listTags } from "./../../logic/api/tag"
import { findItems } from "./../../logic/api/item"
import { listUsers } from "./../../logic/api/user"

const AppDataContext = createContext(null)

const AppDataProvider = (props) => {
    const [tags, setTags] = useState([])
    const [items, setItems] = useState([])
    const [users, setUsers] = useState([])

    const [accessToken] = useUserAuth()

    const loadTags = async () => {
        let tags
        try {
            tags = await listTags(accessToken)
        } catch (e) {
            return
        }

        setTags(tags)
    }

    const loadItems = async (filter) => {
        let items
        try {
            items = await findItems(accessToken, filter)
        } catch (e) {
            return
        }

        setItems(items)
    }

    const loadUsers = async (filter) => {
        let users
        try {
            users = await listUsers(accessToken)
        } catch (e) {
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
