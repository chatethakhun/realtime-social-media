import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, onSnapshot, orderBy, query, QueryDocumentSnapshot, startAfter, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db, storage } from "../lib/firebase";
import { Like } from "../types/like";
import { PostType } from "../types/post";
import useAuth from "./useAuth";
import useToast from "./useToast";

const LIMIT = 10

interface PostProviderProps  {
    children: React.ReactNode,
}
interface PostProps {
    posts: PostType[];
    loading: boolean;
    setPost: (posts: PostType[]) => void;
    deletePost: (post: PostType) => Promise<void>;
    likePost: (post: PostType) => Promise<void>;
    commentPost: (post: PostType, message: string) => Promise<void>;
    fetchMoreData: () => void;
    hasMore: boolean
}


const PostContext = createContext<PostProps>({
    posts: [],
    loading: false,
    setPost: (post: PostType[]) => {},
    deletePost: async (post: PostType) => {},
    likePost: async (post: PostType) => {},
    commentPost: async (post: PostType, message: string) => {},
    fetchMoreData: async() => {},
    hasMore: false
})

export const PostProvider = ({ children }: PostProviderProps) => {
    const [posts, setPosts] = useState<Array<PostType>>([])
    const [loading, setLoading] = useState(false)
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>()
    const [hasMore, sethasMore] = useState(true)
    const [loadingPage, setLoadingPage] = useState(true)
    const { user } = useAuth()
    const [initialLoading, setInitialLoading] = useState(true)
    const { addToast } = useToast()

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(LIMIT)),
            async (snapshot) => {
                const newPost = await getPostWithFormat(snapshot.docs)
                
                setPosts(newPost)
                setLastDoc(snapshot.docs[snapshot.docs.length - 1])
                sethasMore(true)
                setLoadingPage(false)
                setInitialLoading(false)
            }
        );

        return () => {
            unsubscribe();
        };
    }, [db]);

    const setPost = (posts: PostType[]) => {

    }

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
        
        // setPosts([...posts, ...postFromServer])
        if (postFromServer.length == 0 || postFromServer.length < LIMIT) {
            sethasMore(false)
        }


    }


    const getPostWithFormat = async (postDoc: DocumentData) => {
        const tempPost = await Promise.all(postDoc.map(async (document: DocumentData) => {
            const userSnapshot = await getDoc(doc(db, 'users', document.data().userId))
            const likeQuery = query(collection(db, "likes"), where("postId", "==", document.id), where('postId', '==', document.id))
            const likeSnapshot = await getDocs(likeQuery)
            const postLikes = likeSnapshot.docs.map((like) => ({ userId: like.data().userId}))
            
            const post = {
                id: document.id,
                userDisplayName: userSnapshot.data()?.displayName,
                userImage: userSnapshot.data()?.photoURL,
                userEmail: userSnapshot.data()?.email,
                likes: postLikes,
                ...document.data(),
            }
            return post
        }));

        
        return tempPost
    }
    
    const likePost = async (post: PostType) => {
        try {

            let newLikesClone: Like[] = []
            const isLike: Boolean = post.likes.findIndex((like: Like) => like.userId === user?.uid) >= 0

            
            if (!isLike) {
                const likeRef = collection(db, 'likes')
                const data = {
                    userId: user?.uid,
                    postId: post.id
                }

                
                newLikesClone = [...post.likes as Like[], { userId: user?.uid}]
                await addDoc(likeRef, data)
                
            } else {
                const likeQuery = query(collection(db, 'likes'), where('postId', '==', post.id))
                const likeSnapshot = await getDocs(likeQuery)

                const liked = likeSnapshot.docs[0]
                
                
                await deleteDoc(doc(db, 'likes', liked.id))
                newLikesClone = post.likes.filter((like: Like) => like.userId !== user?.uid)
                
            }
            
            const clonePosts: PostType[] = posts.map((data: PostType) => {
                
                if(data.id === post.id) {
                    return {
                        ...data,
                        likes: newLikesClone
                    }
                } 

                return data
                
            })

            setPosts(clonePosts)

        } catch (error) {
            addToast(`Can't like this post.`, { appearance: 'error' })
        }
    }

    const deletePost = async (post: PostType) => {

        try {

            await deleteDoc(doc(db, 'posts', post.id))
            if (post.imageUrl) {
                const postImageRef = ref(storage, post.imageUrl)
                await deleteObject(postImageRef)
            }

            addToast('Delete post successfully', { appearance: 'notice' })
        } catch (error) {

            addToast('Cannot delete post', { appearance: 'error' })
        }
    }


    const commentPost = async (post: PostType, message: string) => {
        try {
            const data = {
                message, 
                userid: user?.uid,
                postId: post.id
            }
            const commentRef = collection(db, 'comments')
    
    
            await addDoc(commentRef, data)

        } catch (error) {
            addToast(`Can't comment this post`, { appearance: 'error'})
        }
        
        
    }
    
    const memoedValue = useMemo(() => ({
        posts, loading, setPost, fetchMoreData, hasMore, likePost, deletePost, commentPost
    }), [loading, posts, hasMore])


    return  <PostContext.Provider value={memoedValue}>
        {!initialLoading && children}
    </PostContext.Provider>   
}

export default function usePost() {
    return useContext(PostContext)
}