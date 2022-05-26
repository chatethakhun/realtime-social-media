
import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });
import { useRef, useState } from 'react'
import useOnClickOutside from '../hooks/useOnClickOutside'

interface EmojiProps {
    onEmojiClick: (event: any, emojiObject: any) => void,
}
const EmojiPicker = ({ onEmojiClick }: EmojiProps) => {
    
    const [showEmojis, setShowEmojis] = useState(false)

    const ref = useRef(null)

    useOnClickOutside(ref, () => {setShowEmojis(false)})
    
    return (
        <div className='relative'>
            <FontAwesomeIcon icon={faSmile} forwardedRef={ref} onClick={() => setShowEmojis(!showEmojis)} className="text-teal-500"/>
            {showEmojis && <div className='w-[280px] absolute'  ref={ref}><Picker onEmojiClick={onEmojiClick} /></div>}
        </div>
        
    )
}

export default EmojiPicker