import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment-timezone'
import Image from "next/image"
import ProfileImage from "./profileImage"
interface PostProps {
    post: {
        userDisplayName: string,
        userEmail: string,
        message: string,
        timestamp: any,
        imageUrl: string,
        userImage: string
    }
}

const Post = ({ post }: PostProps) => {
    return <div className="px-5 border-b-2 border-teal-500 py-5 flex gap-5">
        <ProfileImage imageUrl={post?.userImage} />
        <div className="w-full">
            <div className="flex items-center mb-5">
                <p className="text-white text-xl">{post?.userDisplayName || post?.userEmail}</p>
                <p className="w-full text-white text-right text-sm">{moment(post?.timestamp?.toDate()).fromNow()}</p>
            </div>
            {post.message && <p className="pre-line mt-2 text-white ">{post.message}</p>}
            {post.imageUrl && <div className="w-full h-[300px] relative mt-2 mb-2">
                <Image
                    src={post.imageUrl}
                    alt="Picture of the author"
                    layout="fill"
                    objectFit='contain'
                /></div>}

            <div className="flex gap-3 mt-5 items-center">
                <FontAwesomeIcon icon={faHeart} className={`text-red-500 cursor-pointer`} />
            </div>
        </div>

    </div>
}
export default Post