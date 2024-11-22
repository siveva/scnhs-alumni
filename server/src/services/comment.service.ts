import { ICreateComment } from "../interface/comment.interface";
import prisma from "../utils/db";

export const createComment = async (data: ICreateComment) => {
    return await prisma.comment.create({
        data,
    });
};