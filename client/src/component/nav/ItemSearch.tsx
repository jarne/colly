/**
 * Colly | item search field
 */

import { useState, type ChangeEvent, type SubmitEvent } from "react"
import { useTranslation } from "react-i18next"

type ItemSearchProps = {
    setSearchStr: (value: string) => void
}

function ItemSearch({ setSearchStr }: ItemSearchProps) {
    const { t } = useTranslation()

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
                placeholder={t("navbar.searchPlaceholder")}
                aria-label={t("navbar.search")}
                value={tmpSearchStr}
                onChange={handleTmpSearchStrChange}
                onBlur={handleTmpSearchStrBlur}
            />
            <button type="submit" className="btn btn-outline-primary">
                {t("navbar.searchButton")}
            </button>
        </form>
    )
}

export default ItemSearch
