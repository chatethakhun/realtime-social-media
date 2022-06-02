
interface ModalContainerProps {
    children: React.ReactNode
    modalOpen: boolean
}

const ModalContainer = ({ children, modalOpen }: ModalContainerProps) => {
    return <>{modalOpen && <div className={"flex items-center fixed top-0 bottom-0 left-0 right-0 bg-zinc-900/90 z-[1]"}>{children}</div>}</>
}

export default ModalContainer