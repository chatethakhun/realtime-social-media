import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChangeEvent, useRef } from "react"

interface ProfileImageProps {
    imageUrl: string | null | undefined,
    className?: string,
    sizeImage?: string,
    canEdit?: boolean,
    onUpload?: (image: string) => void
}

const ProfileImage = ({ imageUrl, className = '', sizeImage = 'w-[30px] h-[30px] md:w-[60px] md:h-[60px]', canEdit = false, onUpload }: ProfileImageProps) => {
    const profileInputRef = useRef<HTMLInputElement>(null)
    const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if(!canEdit) return 
        const image = e.target.files
        if (image?.length) {
            const reader = new FileReader()
            reader.readAsDataURL(image[0])
            reader.onload = function (readerEvent) {
                if (readerEvent.target) {
                    onUpload && onUpload(readerEvent.target.result as string)         
                }
            }
        }
    }
    return <div className={` img-profile ${sizeImage} relative m-auto`}>
        <div className={` ${className} w-[100%] h-[100%] rounded-full bg-no-repeat bg-cover bg-center`}
            style={{ backgroundImage: `url(${imageUrl || 'https://source.unsplash.com/user/c_v_r'})` }}
        >

        </div>
        {canEdit && <FontAwesomeIcon icon={faCamera} onClick={() =>  {
            if(null != profileInputRef.current) { profileInputRef.current.click() }
            } } className="text-xl text-white absolute bottom-0 right-0 cursor-pointer" />}
        {canEdit && <input type='file' name="image" className="hidden" onChange={handleImageSelect} ref={profileInputRef}></input>}
    </div>
}

export default ProfileImage