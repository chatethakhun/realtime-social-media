
import { collection, orderBy, query, limit, getDocs, startAt, QueryDocumentSnapshot, DocumentData, startAfter, onSnapshot } from "firebase/firestore"
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
    const [hasMore, sethasMore] = useState(true);
    const [loadingPage, setLoadingPage] = useState(true)

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(LIMIT)),
            (snapshot) => {
                const newPost = [] as any
                snapshot.docs.forEach(snapshot => newPost.push({ ...snapshot.data() }))
                setPosts(newPost)
                setLastDoc(snapshot.docs[snapshot.docs.length - 1])
                sethasMore(true)
                setLoadingPage(false)
            }
        );

        return () => {
            unsubscribe();
        };
    }, [db]);


    const fetchPost = async () => {
        const next = query(collection(db, "posts"),
            orderBy('timestamp', 'desc'),
            startAfter(lastDoc || 0),
            limit(LIMIT));

        const nextdocumentSnapshots = await getDocs(next);
        const newPost = [] as any

        nextdocumentSnapshots.forEach(snapshot => newPost.push({ ...snapshot.data() }))

        setLastDoc(nextdocumentSnapshots.docs[nextdocumentSnapshots.docs.length - 1])


        return newPost
    }

    const fetchMoreData = async () => {
        const postFromServer = await fetchPost()
        setPosts([...posts, ...postFromServer])
        if (postFromServer.length == 0 || postFromServer.length < LIMIT) {
            sethasMore(false)
        }


    }

    const renderFeeds = () => {
        if(loadingPage) {
            return <div className="flex justify-center mt-3 "><Loading /></div>
        }

        return posts.length > 0 ? <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="flex justify-center mt-3 "><Loading /></div>}
        >
            {posts.map(post => <Post post={post} key={post.id} />)}
        </InfiniteScroll> : <div className="text-center text-white"><p>No Post</p></div>
    }


    return <div className=''>
        <h1 className='text-2xl text-teal-500 px-3'>New Feeds</h1>
        <div className='feed-container grid'>
            {renderFeeds()}
        </div>
    </div>


}

export default Feeds