/**
 * Colly | app data provider
 */

import { createContext, useContext, useState } from "react"

import { useUserAuth } from "./UserAuthProvider"
import { listTags } from "./../../logic/api/tag"
import { listItems } from "./../../logic/api/item"

const AppDataContext = createContext(null)

const AppDataProvider = (props) => {
    const [tags, setTags] = useState([])
    const [items, setItems] = useState([])

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

    const loadItems = async () => {
        let items
        try {
            items = await listItems(accessToken)
        } catch (e) {
            return
        }

        setItems(items)
    }

    return (
        <AppDataContext.Provider
            value={[tags, setTags, loadTags, items, setItems, loadItems]}
            {...props}
        />
    )
}

const useAppData = () => useContext(AppDataContext)

export { AppDataProvider, useAppData }
