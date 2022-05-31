
import { async } from "@firebase/util"
import { collection, orderBy, query, limit, getDocs, QueryDocumentSnapshot, DocumentData, startAfter, onSnapshot, deleteDoc, doc, where, getDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import useAuth from "../hooks/useAuth"
import useToast from "../hooks/useToast"
import { db, storage } from "../lib/firebase"
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
        userImage: string,
        userId: string
    }>>([])
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>()
    const [hasMore, sethasMore] = useState(true);
    const [loadingPage, setLoadingPage] = useState(true)
    const { addToast } = useToast()
    const { user } = useAuth()
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(LIMIT)),
            async (snapshot) => {
                const newPost = await getPostWithFormat(snapshot.docs)
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
        const newPost = await getPostWithFormat(nextdocumentSnapshots.docs)

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
            if(post.imageUrl)  {
                const postImageRef = ref(storage, post.imageUrl)
                await deleteObject(postImageRef)
            }

            addToast('Delete post successfully', { appearance: 'notice' })
        } catch (error) {
            console.log(error)
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

    const getPostWithFormat = async (postDoc: DocumentData) => {
        const tempPost = await Promise.all(postDoc.map(async (document: DocumentData) => {
            const snap = await getDoc(doc(db, 'users', document.data().userId))
            
            const post = {
                id: document.id,
                userDisplayName: snap.data()?.displayName,
                userImage: snap.data()?.photoURL,
                userEmail: snap.data()?.email,
                ...document.data(),
            }
            return post
          }));
        return tempPost  
    }

    return <div className=''>
        <h1 className='text-2xl text-teal-500 px-3'>New Feeds</h1>
        <div className='feed-container grid'>
            {renderFeeds()}
        </div>
    </div>


}

export default Feeds