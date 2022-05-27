import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import Image from "next/image"
interface PostProps {
    post: {
        userDisplayName: string,
        userEmail: string,
        message: string,
        timestamp: any,
        imageUrl: string
    }
}

const Post = ({ post }: PostProps) => {
    return <div>
        <div>
            <div className="flex items-center">
                <p className="text-white text-xl">{post?.userDisplayName || post?.userEmail}</p>
                <p className="w-full text-white text-right text-sm">{moment(post?.timestamp?.toDate()).startOf('hour').fromNow()}</p>
            </div>
            {post.message && <p className="pre-line mt-2 text-white ">{post.message}</p>}
            {post.imageUrl && <div className="w-full h-[300px] relative mt-2 mb-2">
                <Image
                    src={post.imageUrl}
                    alt="Picture of the author"
                    layout="fill"
                    objectFit='contain'
                /></div>}
        </div>
        <div className='border border-teal-500 mt-2'></div>
        <div className="flex gap-3 mt-2 items-center">
            <FontAwesomeIcon icon={faHeart} className={`text-red-500 cursor-pointer`} />
        </div>
    </div>
}
export default Post