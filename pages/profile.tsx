
import { updateProfile, User } from "firebase/auth"
import { ChangeEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from "react"
import Container from "../components/container"
import { Input } from "../components/input"
import Loading from "../components/loading"
import ProfileImage from "../components/profileImage"
import useAuth from "../hooks/useAuth"
import useToast from "../hooks/useToast"
import { auth, storage } from "../lib/firebase"
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
const Profile = () => {

    const { user, loading } = useAuth()
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
        let downloadUrl 

        if (isChangeImage) {
            const imageRef = ref(storage, `users/image`)
            await uploadString(imageRef, imageProfile, 'data_url')
              .then(async () => {
                downloadUrl = await getDownloadURL(imageRef)
              }).catch((error) => {
                addToast(error.message, { appearance: 'error' })
              })
          }

        const data = {
            displayName: userDisplayName,
            photoURL: downloadUrl
        }

        

        updateProfile(auth.currentUser as User, data)

        .then(() => {
            addToast('Update Successfully', { appearance: 'notice'})
        })
        .catch((error) => addToast(error.message, { appearance: 'error'}))
        .finally(() => {})
        
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
            
            <div className="form-group w-2/4 m-aut">
                <label htmlFor="displayName" className="text-white">Display Name</label>
                <Input name="displayName" label="displayName" id="displayName" type="text" value={userDisplayName as string} onChange={(e) => setUserDisplayName(e.target.value)}/>
            </div>
            <div className="form-action text-center">
                <button className={`bg-teal-500 p-3 mt-1 rounded text-white mb-3 uppercase  disabled:opacity-50`} onClick={updateUserProfile}>Save Profile</button>
            </div>
            
        </div>
    </Container>
}
export default Profile