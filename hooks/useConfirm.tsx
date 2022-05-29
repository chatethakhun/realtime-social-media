
import { createContext, useContext, useRef, useState } from "react"
import useOnClickOutside from "./useOnClickOutside"
interface ConfirmProps {
    children: React.ReactNode,
}

interface contextProps {
    confirm: (message?: string ) => Promise<any>
}
const ConfirmContext = createContext<contextProps>({
    confirm: async (message?: string) => {}
})

let resolveCallback: any;

export const ConfirmProvider = ({ children }: ConfirmProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [resolveConfirm, setResolveConfrim] = useState(null)
    const confirmRef = useRef(null)


    useOnClickOutside(confirmRef, () => setIsOpen(false))

    const confirm = async (message = 'Are you sure?') => {
        setMessage(message )
        setIsOpen(true)

        return new Promise((resolve, reject) => {
            resolveCallback = resolve
        })
    }

    const sayYes = async () => {
        setIsOpen(false)
        resolveCallback(true)
    }
    const sayNo = async () => {
        setIsOpen(false)
        resolveCallback(false)
    }


    return <ConfirmContext.Provider value={{ confirm }}>
        {children}
        {isOpen && <div className={"flex items-center absolute top-0 bottom-0 left-0 right-0 bg-grey-400"}>
            <div className="w-[300px] rounded p-5  m-auto bg-white text-center" ref={confirmRef}>
                <p>{message || 'Are you sure ?'}</p>
                <div className="flex justify-center gap-3 mt-3">
                    <button className="bg-teal-500 text-white rounded px-10 py-2" onClick={sayYes}>Yes</button>
                    <button className="border border-teal-500 text-white rounded px-10 py-2 text-teal-500" onClick={sayNo}>No</button>
                </div>
            </div>

        </div>}
    </ConfirmContext.Provider>
}


export default function useConfrim() {
    return useContext(ConfirmContext)
}