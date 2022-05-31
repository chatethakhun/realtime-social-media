
import { async } from "@firebase/util"
import { collection, orderBy, query, limit, getDocs, QueryDocumentSnapshot, DocumentData, startAfter, onSnapshot, deleteDoc, doc, where, getDoc, addDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import useAuth from "../hooks/useAuth"
import usePost from "../hooks/usePost"
import useToast from "../hooks/useToast"
import { db, storage } from "../lib/firebase"
import Loading from "./loading"
import { PostType } from "../types/post"
import Post from "./post"


const LIMIT = 10
const Feeds = () => {
    const { addToast } = useToast()
    const { user } = useAuth()
    const { posts, loading, fetchMoreData, hasMore  } = usePost()

    

    

    const renderFeeds = () => {

        
        if (loading) {
            return <div className="flex justify-center mt-3 "><Loading /></div>
        }
        
        return posts.length > 0 ? <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            key={Math.random().toString()}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="flex justify-center mt-3 "><Loading /></div>}
        >
            {posts.map(post => <Post
                post={post}
                key={post.id}
                />)}
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