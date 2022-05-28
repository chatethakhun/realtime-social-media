
import { collection, orderBy, query, limit, getDocs, startAt, QueryDocumentSnapshot, DocumentData } from "firebase/firestore"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { db } from "../lib/firebase"
import Loading from "./loading"
import Post from "./post"


const LIMIT = 10

const Feeds = () => {
    const [posts, setPosts] = useState<Array<{
        id: string,
        userDisplayName: string,
        userEmail: string,
        message: string,
        timestamp: any,
        imageUrl: string,
        userImage: string
    }>>([])
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>()
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, sethasMore] = useState(true);


    useEffect(() => {
        const getPosts = async () => {
            setIsLoading(true)
            const q = query(collection(db, "posts"), orderBy('timestamp', 'desc'), limit(LIMIT));
            const querySnapshot = await getDocs(q);

            if(querySnapshot.docs.length > LIMIT)  {
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
            }

            const posts = [] as any

            querySnapshot.forEach(snapshot => posts.push({ ...snapshot.data() }))
            setPosts(posts)
            setIsLoading(false)
        }

        getPosts()}
        , [])

    const fetchPost = async () => {
        const next = query(collection(db, "posts"),
            orderBy('timestamp', 'desc'),
            startAt(lastDoc || 0),
            limit(LIMIT));

        const nextdocumentSnapshots = await getDocs(next);
        const newPost = [] as any

        nextdocumentSnapshots.forEach(snapshot => newPost.push({ ...snapshot.data() }))

        setLastDoc(nextdocumentSnapshots.docs[nextdocumentSnapshots.docs.length - 1])


        return newPost
    }

    const fetchMoreData = async () => {
        const postFromServer = await fetchPost()

        if (postFromServer.length == 0 || postFromServer.length < LIMIT) {
            sethasMore(false)
        }

        setPosts(posts => [...posts, ...postFromServer])
    }

    return <div className=''>
        <h1 className='text-2xl text-teal-500 px-3'>New Feeds</h1>
        <div className='feed-container grid'>
            {posts.length > 0 ? <InfiniteScroll
                dataLength={posts.length} //This is important field to render the next data
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<div className="flex justify-center mt-3 "><Loading /></div>}
            >
                {posts.map(post => <Post post={post} key={post.id} />)}
            </InfiniteScroll> : <div className="text-center text-white"><p>No Post</p></div>}
        </div>
    </div>
}

export default Feeds