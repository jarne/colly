/**
 * Colly | dashboard page
 */

import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { toast } from "react-toastify"

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
import { updateItem } from "./../logic/api/item"

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
    const handleItemPinClick = async (item) => {
        try {
            await updateItem(
                item._id,
                {
                    url: item.url,
                    name: item.name,
                    description: item.description,
                    tags: item.tags,
                    isPinned: !item.isPinned,
                },
                workspace,
                accessToken
            )
        } catch (ex) {
            toast.error(ex.message)

            return
        }
        toast.success(`Item ${!item.isPinned ? "pinned" : "unpinned"}!`)

        // Reload items so the list re-renders
        await triggerItemLoad()
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
                                handleItemPinClick={handleItemPinClick}
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
