import express from "express"
import { deleteUser, getAllUsers, getUserByid, updateUser, userApproved } from "../services/auth.service";
import { upload } from "../utils/upload";

const userRoute = express.Router();

userRoute.get("/", async (_req, res) => {
    try {
        const users = await getAllUsers();

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json(err);
    }
});

userRoute.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserByid(id as string);

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

userRoute.post("/update",upload.single("image") ,async (req, res) => {
    try {
       const body = req.body;
       const image = req.file as Express.Multer.File;
       let payload;
       if(image) {
        payload = {
            ...body,    
            image: image.filename,
            batch: Number(body.batch)
        };
       } else {
        payload = {
            ...body,
            batch: Number(body.batch)
        };
       }

       const user = await updateUser(body.id, payload);

        return res.status(200).json(user);
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json(err);
    }
});

userRoute.post("/approved", async (req, res) => {
    try {
       const body = req.body;

       const user = await userApproved(body.id);

        return res.status(200).json(user);
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json(err);
    }
});

userRoute.post("/delete", async (req, res) => {
    try {
       const body = req.body;

       const user = await deleteUser(body.id);

        return res.status(200).json(user);
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json(err);
    }
});

export default userRoute;
