import { Like } from "./like";

export interface  PostType  {
    id: string, 
    userDisplayName: string,
    userEmail: string,
    message: string,
    timestamp: any,
    imageUrl: string,
    userImage: string,
    userId: string,
    likes: Like[],
}


