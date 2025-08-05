/**
 * Colly | sort order select field
 */

import { useCurrentInput } from "./../../component/context/CurrentInputProvider"

function SortSelect() {
    const { sortValue, setSortValue } = useCurrentInput()

    const handlSortValueChange = (e) => {
        setSortValue(e.target.value)
    }

    return (
        <div className="d-flex align-items-center me-3">
            <span className="me-2">Sort: </span>
            <select
                id="sortSelect"
                className="form-select"
                value={sortValue}
                onChange={handlSortValueChange}
            >
                <option value="-updatedAt">Updated</option>
                <option value="updatedAt">Updated (oldest first)</option>
                <option value="-createdAt">Created</option>
                <option value="createdAt">Created (oldest first)</option>
                <option value="name">Title</option>
                <option value="-name">Title (desc)</option>
            </select>
        </div>
    )
}

export default SortSelect
