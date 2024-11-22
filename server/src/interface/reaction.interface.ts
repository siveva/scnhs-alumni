import { ReactionType } from "@prisma/client"

export interface ICreatePostReaction {
    postId: number;
    userId: string;
    type: ReactionType;
}

export interface ICreateCommentReaction {
    commentId: number;
    userId: string;
    type: ReactionType;
}