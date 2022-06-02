import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faComment, faTrash } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment-timezone'
import Image from "next/image"
import ProfileImage from "./profileImage"
import useConfrim from "../hooks/useConfirm"
import useAuth from "../hooks/useAuth"
import { PostType } from "../types/post"
import usePost from "../hooks/usePost"
import { Like } from "../types/like"
import { useModal } from "../hooks/useModal"
import ModalContainer from "./modalContainer"
import { useRef } from "react"
import useOnClickOutside from "../hooks/useOnClickOutside"


interface PostProps {
    post: PostType
    theme?: string
}

const PostContent = ({ post, theme = 'dark' }: PostProps) => {
    const textColor = theme === 'dark' ? 'text-white' : 'text-grey'
    return <div className="w-full">
        <div className="flex items-center mb gap-5">
            <div className="basis-[40px] md:basis-[65px]">
                <ProfileImage imageUrl={post?.userImage} />
            </div>
            <div className="basis-[100%] flex items-center">
                <p className={`${textColor} text-xl`}>{post?.userDisplayName || post?.userEmail}</p>
                <p className={`w-full ${textColor} text-right text-sm`}>{moment(post?.timestamp?.toDate()).fromNow()}</p>
            </div>
        </div>
        <div className="flex gap-5">
            <div className="basis-[40px] md:basis-[65px]"></div>
            <div className="basis-[100%]">
                {post.message && <p className={`pre-line mt-2 ${textColor}`}>{post.message}</p>}
            </div>
        </div>
    {post.imageUrl && <div className="w-full h-[300px] relative mt-2 mb-2">
                <Image
                    src={post.imageUrl}
                    alt="Picture of the author"
                    layout="fill"
                    objectFit='contain'
                /></div>
            }
    </div>
}

const Post = ({ post }: PostProps) => {
    const { confirm } = useConfrim()
    const { user } = useAuth()
    const { deletePost, likePost } = usePost()
    const { modalOpen, toggle } = useModal()
    const modalRef = useRef(null)

    useOnClickOutside(modalRef, () => toggle(false))

    const isLike: Boolean = post.likes.findIndex((like: Like) => like.userId === user?.uid) >= 0
    return <div className="px-3 md:px-5 border-b-2 border-teal-500 py-5 flex flex-col">

        <PostContent post={post} />
        <div className="flex gap-5 mt-5">
            <div className="basis-[40px] md:basis-[65px]"></div>
            <div className="basis-[100%]">
                <div className="flex gap-5 items-center flex-1">
                    <FontAwesomeIcon icon={faThumbsUp} className={`text-white cursor-pointer ${isLike ? 'text-teal-500' : ''}`} onClick={() => {
                        likePost(post)

                    }} />
                    {post.likes.length > 0 && <p className="text-white">{post.likes.length}</p>}
                    <FontAwesomeIcon icon={faComment} className={`text-white cursor-pointer`} onClick={() => toggle(true)} />
                    {post.userId === user?.uid &&
                        <div className="w-full text-right">
                            <FontAwesomeIcon icon={faTrash} className={`text-white cursor-pointer`} onClick={async () => {
                                const isConfirm = await confirm('Delete post?')
                                if (isConfirm) {
                                    deletePost(post)
                                }
                            }
                            } />
                        </div>
                    }
                </div>
            </div>
        </div>

        <ModalContainer modalOpen={modalOpen}>
            <div className="w-[1000px] bg-white m-auto p-5" ref={modalRef}>
                <PostContent post={post} theme="white"/>
            </div>
        </ModalContainer>
    </div>
}
export default Post

