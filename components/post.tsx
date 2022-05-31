import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faComment, faTrash } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment-timezone'
import Image from "next/image"
import ProfileImage from "./profileImage"
import useConfrim from "../hooks/useConfirm"
import useAuth from "../hooks/useAuth"
import { PostType } from "../types/post"
import { useState } from "react"


interface PostProps {
    post: PostType,
    onDeletePost: (post: PostType) => void,
    onLikePost: (post: PostType) => void
}

const Post = ({ post, onDeletePost, onLikePost }: PostProps) => {
    const { confirm } = useConfrim()
    const { user } = useAuth()
    const [liked, setLiked ] = useState(post.isLiked)
    
    return <div className="px-3 md:px-5 border-b-2 border-teal-500 py-5 flex gap-2 md:gap-5">
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

            <div className="flex gap-5 mt-5 items-center">
                <FontAwesomeIcon icon={faThumbsUp} className={`text-white cursor-pointer ${liked ? 'text-teal-500' : ''}`} onClick={() => {
                    setLiked(!liked)
                    onLikePost(post)}}/>
                <FontAwesomeIcon icon={faComment} className={`text-white cursor-pointer`} />
                { post.userId === user?.uid &&
                    <div className="w-full text-right">
                        <FontAwesomeIcon icon={faTrash} className={`text-white cursor-pointer`} onClick={async () => {
                            const isConfirm = await confirm('Delete post?')
                            if(isConfirm) {
                                onDeletePost(post)
                            }
                        }
                            } />
                    </div>
                }
            </div>
        </div>

    </div>
}
export default Post

export { PostType }