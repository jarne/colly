/**
 * Colly | dashboard page
 */

import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import Navbar from "./../component/nav/Navbar"
import TagsSidebar from "./../component/tag/TagsSidebar"
import ItemCard from "./../component/item/ItemCard"

import CreateTagModal from "./../component/modal/CreateTagModal"
import CreateItemModal from "./../component/modal/CreateItemModal"
import PreferencesModal from "./../component/modal/PreferencesModal"

import { useUserAuth } from "./../component/context/UserAuthProvider"
import { useAppData } from "./../component/context/DataProvider"
import { useCurrentInput } from "./../component/context/CurrentInputProvider"

import "./Dashboard.css"

function Dashboard() {
    const navigate = useNavigate()
    const { tagId } = useParams()

    const { accessToken } = useUserAuth()
    const { items, loadItems } = useAppData()
    const { workspace, setSelectedTag, searchStr, sortValue } =
        useCurrentInput()

    const createTagModalRef = useRef()
    const createItemModalRef = useRef()
    const preferencesModalRef = useRef()

    const triggerItemLoad = async () => {
        let filter = {}

        if (tagId) {
            filter.tags = tagId
        }
        if (searchStr !== "") {
            filter.$text = {
                $search: searchStr,
            }
        }

        try {
            await loadItems({
                filter,
                sort: sortValue,
            })
        } catch {
            navigate("/login")
        }
    }

    useEffect(() => {
        setSelectedTag(tagId)
        triggerItemLoad()
    }, [accessToken, workspace, tagId, searchStr, sortValue])

    return (
        <>
            <Navbar
                createTagModalRef={createTagModalRef}
                createItemModalRef={createItemModalRef}
                preferencesModalRef={preferencesModalRef}
            />
            <main className="dashboard-main">
                <TagsSidebar
                    createTagModalRef={createTagModalRef}
                    activeTag={tagId}
                />
                <ResponsiveMasonry className="w-100 m-3 main-cards-view">
                    <Masonry gutter="16px">
                        {items.map((item) => {
                            return (
                                <ItemCard
                                    key={item._id}
                                    item={item}
                                    createItemModalRef={createItemModalRef}
                                />
                            )
                        })}
                    </Masonry>
                </ResponsiveMasonry>
            </main>
            <CreateTagModal ref={createTagModalRef} />
            <CreateItemModal
                triggerItemLoad={triggerItemLoad}
                ref={createItemModalRef}
            />
            <PreferencesModal ref={preferencesModalRef} />
        </>
    )
}

export default Dashboard
