
import { collection, orderBy, query, limit, getDocs, QueryDocumentSnapshot, DocumentData, startAfter, onSnapshot, deleteDoc, doc, where, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import useAuth from "../hooks/useAuth"
import useToast from "../hooks/useToast"
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
    const { addToast } = useToast()
    const { user } = useAuth()
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(LIMIT)),
            (snapshot) => {
                setPostWithFormat(snapshot.docs)
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

        nextdocumentSnapshots.forEach(snapshot => newPost.push({ ...snapshot.data(), id: snapshot.id }))

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

    const deletePost = async (post: Post) => {
        try {
            await deleteDoc(doc(db, 'posts', post.id))
            addToast('Delete post successfully', { appearance: 'notice' })
        } catch (error) {
            addToast('Cannot delete post', { appearance: 'error' })
        }
    }

    const renderFeeds = () => {
        if (loadingPage) {
            return <div className="flex justify-center mt-3 "><Loading /></div>
        }

        return posts.length > 0 ? <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            key={Math.random().toString()}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="flex justify-center mt-3 "><Loading /></div>}
        >
            {posts.map(post => <Post post={post} key={post.id} onDeletePost={deletePost} />)}
        </InfiniteScroll> : <div className="text-center text-white"><p>No Post</p></div>
    }

    const setPostWithFormat = (postDoc: DocumentData) => {
        const newPost = [] as any
        console.log(postDoc);
        postDoc.forEach(async (postDoc: DocumentData) => {
            const snap = await getDoc(doc(db, 'users', postDoc.data().userId))    
            newPost.push({
                message: postDoc.data().message,
                userEmail: snap.data()?.email,
                userDisplayName: snap.data()?.displayName,
                userImage: snap.data()?.photoURL,
                ...postDoc.data()
            })

            setPosts(newPost)
        })        

        
        
    }


    return <div className=''>
        <h1 className='text-2xl text-teal-500 px-3'>New Feeds</h1>
        <div className='feed-container grid'>
            {renderFeeds()}
        </div>
    </div>


}

export default Feeds