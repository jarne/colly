/**
 * Colly | dashboard page
 */

import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import Navbar from "./../component/nav/Navbar"
import TagsSidebar from "./../component/tag/TagsSidebar"
import ItemCard from "./../component/item/ItemCard"

import CreateWorkspaceModal from "./../component/modal/CreateWorkspaceModal"
import CreateTagModal from "./../component/modal/CreateTagModal"
import CreateItemModal from "./../component/modal/CreateItemModal"
import PreferencesModal from "./../component/modal/PreferencesModal"

import { useUserAuth } from "./../component/context/UserAuthProvider"
import { useAppData } from "./../component/context/DataProvider"
import { useCurrentInput } from "./../component/context/CurrentInputProvider"

import "./Dashboard.css"

function Dashboard() {
    const navigate = useNavigate()
    const { wsId, tagId } = useParams()

    const { accessToken } = useUserAuth()
    const { workspaces, items, loadItems } = useAppData()
    const { workspace, setWorkspace, setSelectedTag, searchStr, sortValue } =
        useCurrentInput()

    const createWorkspaceModalRef = useRef()
    const createTagModalRef = useRef()
    const createItemModalRef = useRef()
    const preferencesModalRef = useRef()

    const checkWorkspaceActive = () => {
        if (wsId) {
            return
        }

        if (workspaces.length < 1) {
            return
        }

        const firstWorkspace = workspaces[0]
        navigate(`/workspace/${firstWorkspace._id}`)
    }

    const triggerItemLoad = async () => {
        if (!workspace) {
            return
        }

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
                sort: `-isPinned ${sortValue}`,
            })
        } catch {
            navigate("/login")
        }
    }

    useEffect(() => {
        setWorkspace(wsId)
        setSelectedTag(tagId)

        checkWorkspaceActive()
        triggerItemLoad()
    }, [accessToken, wsId, workspace, workspaces, tagId, searchStr, sortValue])

    return (
        <>
            <Navbar
                createWorkspaceModalRef={createWorkspaceModalRef}
                createTagModalRef={createTagModalRef}
                createItemModalRef={createItemModalRef}
                preferencesModalRef={preferencesModalRef}
            />
            <main className="dashboard-main">
                <TagsSidebar
                    createWorkspaceModalRef={createWorkspaceModalRef}
                    createTagModalRef={createTagModalRef}
                    activeTag={tagId}
                />
                <ResponsiveMasonry className="w-100 m-3 main-cards-view">
                    <Masonry gutter="16px">
                        {items.map((item) => (
                            <ItemCard
                                key={item._id}
                                item={item}
                                createItemModalRef={createItemModalRef}
                                triggerItemLoad={triggerItemLoad}
                            />
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </main>
            <CreateWorkspaceModal ref={createWorkspaceModalRef} />
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
