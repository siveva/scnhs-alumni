import { PostType } from "@prisma/client";
import { ICreatePost } from "../interface/post.interface"
import prisma from "../utils/db"
//import fs from "fs/promises";

export const createPost = async (data: ICreatePost) => {
    const { title, description, createdById, postType } = data;
    return await prisma.post.create({
        data: {
            title,
            description,
            createdById,
            postType
        }
    })
}

// export const uploadPostImage = async (file: any[], postId: number) => {
//     const images = await Promise.all(
//         file.map(async (image) => {
//         //   const fileBuffer = await fs.readFile(image.path);
//         //   const base64Image = fileBuffer.toString("base64");
    
//           return {
//             postId,
//             image: `/uploads/${image.filename}`,
//           };
//         })
//     );

//     return await prisma.postImages.createMany({
//         data: images,
//     })
// }

export const getAllPosts = async (type: PostType) => {
    const posts = await prisma.post.findMany({
        where: {
            isDeleted: false,
            postType: type,
        },
        include: {
            comment: {
                include: {
                    user: true,
                },
            },
            postReaction: {
                include: {
                    user: true,
                },
            },
            eventRegistration: {
                include: {
                    user: true,
                }
            },
            createdBy: true,
        },
        orderBy: { createdAt: "desc" },
    });

    if (posts.length === 0) {
        return [];
    }

    const formattedPosts = posts.map((post) => {
        const likeCount = post.postReaction.filter((reaction) => reaction.type === 'LIKE').length;
        const loveCount = post.postReaction.filter((reaction) => reaction.type === 'LOVE').length;
      
        return {
            ...post,
          likeCount,
          loveCount,
        };
      });
    
    return formattedPosts  
}

export const updatePost = async (id: number, data: ICreatePost) => {
    const { title, description } = data;
    return await prisma.post.update({
        where: {
            id
        },
        data: {
            title,
            description
        }
    })
}

export const deletePost = async (id: number) => {
    return await prisma.post.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    })
}

export const joinEvent = async (id: number, userId: string) => {
   return await prisma.eventRegistration.create({
       data: {
           eventId: id,
           userId
       }
   })
}