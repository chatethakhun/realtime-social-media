import { createContext, useContext, useEffect, useState } from "react"
import style from '../styles/components/toast.module.scss'

interface ToastProviderProps {
    children: React.ReactNode,
    autoRemoveToast?: boolean
}

interface ToastProps {
    addToast: (message: string, option: { appearance: 'notice' | 'error' }) => void
}

const ToastContext = createContext<ToastProps>({
    addToast: () => { }
})

export const ToastProvider = ({ children, autoRemoveToast = true }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<Array<{
        id: string,
        message: string,
        option: {
            appearance: string
        }
    }>>([])

    useEffect(() => {
        if (!autoRemoveToast) return

        if (toasts.length) {
            const time = setTimeout(() => {
                setToasts(toasts => toasts.slice(1))
            }, 5000)

            return () => clearTimeout(time)
        }
    }, [toasts])

    const addToast = (message: string, option: any) => {

        setToasts((toasts) => [...toasts,
        {
            id: Math.random().toString(),
            message,
            option
        }])
    }

    const notice = 'text-teal-500 border-teal-500 bg-teal-200'
    const error = 'text-red-500 border-red-500 bg-red-200'

    return <ToastContext.Provider
        value={{ addToast }}>
        {children}
        {toasts.length && <div className="toast-container absolute bottom-[10px] left-2/4 translate-x-[-50%] ">
            {toasts.map(toast => <div className={`${style.toast_animation} px-4 py-3 min-w-[200px] border rounded ${toast.option.appearance === 'error' ? error : notice} text-center mb-3 transition ease-in-out translate-y-[0]`} key={toast.id}>{toast.message}</div>)}
        </div>}
    </ToastContext.Provider>
}


export default function useToast() {
    return useContext(ToastContext)
}