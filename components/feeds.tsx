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


    return <div className=''>
        <h1 className='text-2xl text-teal-500 px-3'>New Feeds</h1>
        {!loading ? <div className='feed-container grid'>
            {posts && posts.length ?
                posts.map((post: any) => <Post key={post.id} post={post.data()} />)
                : <div className="text-center text-white">No posts.</div>}
        </div> : <div className="mt-5 flex justify-center"><Loading /></div>}
    </div>
}

export default Feeds