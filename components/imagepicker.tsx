import { faImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChangeEvent, useRef } from "react"

interface ImagePickerProps {
    name: string,
    onSelected: (image: File) => void
}
const ImagePicker = ({ name, onSelected }: ImagePickerProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const selectImage = () => {
        if (null != inputRef.current) {
            inputRef.current.click()
        }
    }

    const onSelectedImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files
        if(image?.length) {
            onSelected(image[0])
        }
    }

    return (
        <div className="image-container">
            <label htmlFor={name} onClick={selectImage}>
                <FontAwesomeIcon icon={faImage} className="text-teal-400" />
            </label>
            <input type="file" name={name} className="hidden" ref={inputRef} onChange={onSelectedImageChange}></input>
        </div>
    )
}

export default ImagePicker