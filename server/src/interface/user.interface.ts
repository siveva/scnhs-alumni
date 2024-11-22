import { UserRole } from "@prisma/client";

export interface IUser {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    contact: string;
    job: string;
    address: string;
    role: UserRole;
    batch: number;
}