/**
 * Colly | sort order select field
 */

import { type ChangeEvent } from "react"
import { useTranslation } from "react-i18next"
import { useCurrentInput } from "../context/CurrentInputProvider"

function SortSelect() {
    const { t } = useTranslation()
    const { sortValue, setSortValue } = useCurrentInput()

    const handlSortValueChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortValue(e.target.value)
    }

    return (
        <div className="d-flex align-items-center me-3">
            <span className="me-2">{t("navbar.sort.label")}</span>
            <select
                id="sortSelect"
                className="form-select"
                value={sortValue}
                onChange={handlSortValueChange}
            >
                <option value="-updatedAt">{t("navbar.sort.updated")}</option>
                <option value="updatedAt">
                    {t("navbar.sort.updatedOldest")}
                </option>
                <option value="-createdAt">{t("navbar.sort.created")}</option>
                <option value="createdAt">
                    {t("navbar.sort.createdOldest")}
                </option>
                <option value="name">{t("navbar.sort.title")}</option>
                <option value="-name">{t("navbar.sort.titleDesc")}</option>
            </select>
        </div>
    )
}

export default SortSelect
