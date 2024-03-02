/**
 * Colly | dashboard page
 */

import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import Navbar from "./../component/Navbar"
import TagsSidebar from "./../component/tag/TagsSidebar"
import ItemCard from "./../component/item/ItemCard"

import CreateTagModal from "./../component/modal/CreateTagModal"
import CreateItemModal from "./../component/modal/CreateItemModal"

import { useUserAuth } from "./../component/context/UserAuthProvider"
import { useAppData } from "./../component/context/DataProvider"

import "./Dashboard.css"

function Dashboard() {
    const navigate = useNavigate()
    const { tagId } = useParams()

    const [accessToken] = useUserAuth()
    const [, , , items, , loadItems] = useAppData()

    const createTagModalRef = useRef()
    const createItemModalRef = useRef()

    useEffect(() => {
        if (accessToken === null) {
            navigate("/login")

            return
        }

        loadItems()
    }, [accessToken])

    return (
        <>
            <Navbar
                createTagModalRef={createTagModalRef}
                createItemModalRef={createItemModalRef}
            />
            <main className="dashboard-main">
                <TagsSidebar createTagModalRef={createTagModalRef} />
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
            <CreateItemModal ref={createItemModalRef} />
        </>
    )
}

export default Dashboard
