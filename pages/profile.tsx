
import { updateProfile, User } from "firebase/auth"
import { ChangeEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from "react"
import Container from "../components/container"
import { Input } from "../components/input"
import Loading from "../components/loading"
import ProfileImage from "../components/profileImage"
import useAuth from "../hooks/useAuth"
import useToast from "../hooks/useToast"
import { auth, db, storage } from "../lib/firebase"
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { doc, getDoc, updateDoc } from "firebase/firestore"
const Profile = () => {

    const { user, loading } = useAuth()
    const [ isLoading, setIsLoading ] = useState(false)
    const [imageProfile, setImageProfile] = useState<string>('')
    const [ userDisplayName, setUserDisplayName] = useState<string | null | undefined>('')
    const [isChangeImage, setIsChangeImage] = useState<boolean>(false)
    const { addToast } = useToast()

    useEffect(() => {
        if (!loading) {
            user?.photoURL && setImageProfile(user?.photoURL)
            user?.displayName && setUserDisplayName(user?.displayName)
        }
    }, [loading])


    const updateUserProfile =  async (e: any) => {
        setIsLoading(true)
        const data = {
            displayName: userDisplayName,
            
        }
        if (isChangeImage) {
            const imageRef = ref(storage, `users/${user?.uid}/image`)
            await uploadString(imageRef, imageProfile, 'data_url')
              .then(async () => {
                const downloadUrl = await getDownloadURL(imageRef)
                Object.assign( data,{ photoURL: downloadUrl });
              }).catch((error) => {
                addToast(error.message, { appearance: 'error' })
              })
          }

    

        updateProfile(auth.currentUser as User, data)

        .then(() => {
            updateUser(data as any)
            addToast('Update Successfully', { appearance: 'notice'})
        })
        .catch((error) => addToast(error.message, { appearance: 'error'}))
        .finally(() => { setIsLoading(false)})
        
    }

    const updateUser = async (data: { displayName: string, phhotoURL: string}) => {
        const userId = user?.uid as string
        const snap = await getDoc(doc(db, 'users', userId))   

        await updateDoc(doc(db, 'users', userId), data)
        
    }

    if (loading) {
        return <Container>
            <div className="flex justify-center">
                <Loading />
            </div>
        </Container>
    }

    return <Container>
        <ProfileImage imageUrl={imageProfile} sizeImage='h-[200px] w-[200px]' canEdit={true} onUpload={(image: string) => {
            setIsChangeImage(true)
            setImageProfile(image)}} />

        <div className="mt-10">
            
            <div className="form-group w-2/4 m-auto">
                <label htmlFor="displayName" className="text-white">Display Name</label>
                <Input name="displayName" label="displayName" id="displayName" type="text" value={userDisplayName as string} onChange={(e) => setUserDisplayName(e.target.value)}/>
            </div>
            <div className="form-action text-center">
                <button className={`bg-teal-500 p-3 mt-1 rounded text-white mb-3 uppercase  disabled:opacity-50`} onClick={updateUserProfile}>{isLoading ? <Loading /> : "Save Profile"}</button>
            </div>
            
        </div>
    </Container>
}
export default Profile