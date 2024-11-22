import jwt from "jsonwebtoken"

const secret = "williamSadam00817"

export const signToken = (payload: any) =>{
    const expiresIn = 3600 * 8;
    return jwt.sign(payload, secret ?? '', { expiresIn });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, secret ?? '');
}