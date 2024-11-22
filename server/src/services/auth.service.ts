import { IUser } from "../interface/user.interface"
import prisma from "../utils/db"

export const getUserByUsername = async(username: string) => {
    return await prisma.user.findFirst({
        where: {
            username,
            isDeleted: false
        }
    })
}

export const createUser = async(payload: IUser) => {
    return await prisma.user.create({
        data: {
            ...payload,
        },
    })
}

export const getAllUsers = async () => {
    return await prisma.user.findMany({
        where: {
            isDeleted: false,
            role: "USER" 
        },
        orderBy: [{firstname: "asc"}, {lastname: "asc"}]
    });
}

export const getUserByid = async(id: string) => {
    return await prisma.user.findFirst({
        where: {
            id
        }
    });
}

export const updateUser = async(id: string, payload: IUser) => {
    return await prisma.user.update({
        where: {
            id
        },
        data: payload
    });
}

export const deleteUser = async (id: string) => {
    return await prisma.user.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    });
}

export const userApproved = async (id: string) => {
    return await prisma.user.update({
        where: {
            id
        },
        data: {
            isApproved: true
        }
    });
}