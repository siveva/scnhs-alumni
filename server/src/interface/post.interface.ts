import { PostType } from "@prisma/client";

export interface ICreatePost {
    title: string;
    description: string;
    createdById: string;
    postType: PostType;
}