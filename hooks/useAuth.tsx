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
import { auth, db } from '../lib/firebase'
import useToast from "./useToast"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"




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
    const { addToast } = useToast()
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            } else {
                setUser(null)
                router.push('/auth')
            }
            setLoading(false)
            setInitialLoading(false)
        })
    }, [auth])

    const createUser = async (user: User) => {
        const userRef = doc(db, "users" , user.uid);
        await setDoc(userRef, {
            email: user.email
        })
    }

    const signUp = async (email: string, password: string) => {
        setLoading(true)
        
        await createUserWithEmailAndPassword(auth, email, password).then((useCredential) => {
            createUser(useCredential.user)
            setUser(useCredential.user)
            router.push('/')
            setLoading(false)
        })
            .catch((error) => addToast(error.message, { appearance: "error" }))
            .finally(() => setLoading(false))
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)

        await signInWithEmailAndPassword(auth, email, password).then((useCredential) => {
            setUser(useCredential.user)
            router.push('/')
            setLoading(false)
        })
            .catch((error) => addToast(error.message, { appearance: "error" }))
            .finally(() => setLoading(false))
    }

    const logout = async () => {

        setLoading(true)

        await signOut(auth)
            .then(() => setUser(null))
            .catch((error) => addToast(error.message, { appearance: "error" }))
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