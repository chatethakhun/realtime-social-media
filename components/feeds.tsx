import { useState } from "react"

const Feeds = () => {
    const [posts, setPosts] = useState([])

    return <div className='mt-5'>
        <h1 className='text-2xl text-white'>New Feeds</h1>
        <div className='feed-container mt-3'>
            { posts.length ? <div>Have Feeds</div> : <div className="text-center">No posts.</div>}
        </div>
    </div>
}

export default Feeds