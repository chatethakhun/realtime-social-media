import {
    useState,
    createContext, useContext, useMemo, useEffect
} from "react"
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User
} from 'firebase/auth'
import { useRouter } from "next/router"
import { auth } from '../lib/firebase'
import {  useToasts } from 'react-toast-notifications';



interface AuthProvierProps {
    children: React.ReactNode
}

interface IAuth {
    user: User | null,
    signUp: (email: string, password: string) => Promise<void>,
    signIn: (email: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
    error: string | null,
    loading: Boolean
}

const AuthContext = createContext<IAuth>({
    user: null,
    signUp: async () => { },
    signIn: async () => { },
    logout: async () => { },
    error: null,
    loading: false
})

export const AuthProvider = ({ children }: AuthProvierProps) => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { addToast, removeAllToasts } = useToasts()
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
                setLoading(false)
            } else {
                setUser(null)
                setLoading(false)
                router.push('/auth')
            }

            setInitialLoading(false)
        })
    }, [auth])

    const signUp = async (email: string, password: string) => {
        setLoading(true)
        removeAllToasts()
        await createUserWithEmailAndPassword(auth, email, password).then((useCredential) => {
            setUser(useCredential.user)
            router.push('/')
            setLoading(false)
        })
            .catch((error) => addToast(error.message, { appearance: 'error' }))
            .finally(() => setLoading(false))
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        removeAllToasts()
        await signInWithEmailAndPassword(auth, email, password).then((useCredential) => {
            setUser(useCredential.user)
            router.push('/')
            setLoading(false)
        })
            .catch((error) => addToast(error.message, { appearance: 'error' }))
            .finally(() => setLoading(false))
    }

    const logout = async () => {

        setLoading(true)
        removeAllToasts()
        await signOut(auth)
            .then(() => setUser(null))
            .catch((error) => addToast(error.message, { appearance: 'error' }))
            .finally(() => setLoading(false))
    }

    const memoedValue = useMemo(() => ({
        user, signUp, signIn, logout, loading, error
    }), [loading, user])

    return <AuthContext.Provider value={memoedValue}>{!initialLoading && children}</AuthContext.Provider>
}

export default function useAuth() {
    return useContext(AuthContext)
}