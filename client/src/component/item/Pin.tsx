/**
 * Colly | item pin icon
 */

import { useTranslation } from "react-i18next"

import "./Pin.css"

type PinProps = {
    isPinned: boolean
}

export default function Pin({ isPinned }: PinProps) {
    const { t } = useTranslation()

    return isPinned ? (
        <i
            className="bi bi-pin-angle-fill item-pin"
            aria-label={t("item.pinAria")}
        ></i>
    ) : (
        <i
            className="bi bi-pin-angle item-pin"
            aria-label={t("item.unpinAria")}
        ></i>
    )
}
