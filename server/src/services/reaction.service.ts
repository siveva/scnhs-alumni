import { ICreatePostReaction } from "../interface/reaction.interface";
import prisma from "../utils/db";

export const createPostReaction = async (data: ICreatePostReaction) => {
    const checkDuplicate = await prisma.postReaction.findFirst({
        where: {
            postId: data.postId,
            userId: data.userId
        }
    });

    if(checkDuplicate){
        return;
    }
    
    return await prisma.postReaction.create({
        data,
    });
};