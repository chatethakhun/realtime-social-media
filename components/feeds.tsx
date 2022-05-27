import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../lib/firebase"
import Loading from "./loading"
import Post from "./post"

const Feeds = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => onSnapshot(
        query(collection(db, "posts"), orderBy('timestamp', 'desc')),
        (snapshot) => {
            const posts = snapshot.docs as []
            setPosts(posts)
            setLoading(false)
        }
    )
        , [db])


    return <div className='mt-5'>
        <h1 className='text-2xl text-white'>New Feeds</h1>
        {!loading ? <div className='feed-container mt-3 grid gap-9'>
            {posts && posts.length ?
                posts.map((post: any) => <Post key={post.id} post={post.data()} />)
                : <div className="text-center">No posts.</div>}
        </div> : <div className="mt-5 flex justify-center"><Loading /></div>}
    </div>
}

export default Feeds