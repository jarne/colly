/**
 * Colly | item search field
 */

import { useState, type ChangeEvent, type SubmitEvent } from "react"

type ItemSearchProps = {
    setSearchStr: (value: string) => void
}

function ItemSearch({ setSearchStr }: ItemSearchProps) {
    const [tmpSearchStr, setTmpSearchStr] = useState("")

    const handleTmpSearchStrChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTmpSearchStr(e.target.value)
    }
    const handleTmpSearchStrBlur = () => {
        if (tmpSearchStr === "") {
            setSearchStr("")
        }
    }

    const handleSearchSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        setSearchStr(tmpSearchStr)
    }

    return (
        <form
            className="d-flex me-3"
            role="search"
            onSubmit={handleSearchSubmit}
        >
            <input
                type="search"
                className="form-control me-2"
                id="tagNameInput"
                placeholder="Search"
                aria-label="Search"
                value={tmpSearchStr}
                onChange={handleTmpSearchStrChange}
                onBlur={handleTmpSearchStrBlur}
            />
            <button type="submit" className="btn btn-outline-primary">
                Search
            </button>
        </form>
    )
}

export default ItemSearch
