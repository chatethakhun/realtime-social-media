import { useState } from "react"


export const useModal = () => {
    const [modalOpen, setModalOpen] = useState(false) 

    const toggle = (open: boolean) => {
        setModalOpen(open)
    }

    return { modalOpen, toggle }
}
