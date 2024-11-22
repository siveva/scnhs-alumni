import express from "express"
import { createPost, deletePost, getAllPosts, joinEvent, updatePost } from "../services/post.service";
import { getAllUsers } from "../services/auth.service";
import { PostType } from "@prisma/client";
import { sentTwilioSms } from "../services/sms.service";
//import { upload } from "../utils/upload";

const postRoute = express.Router();

postRoute.get("/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const posts = await getAllPosts(type as PostType);

        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
});

postRoute.post("/create", async (req, res) => {
    try {
        const body = req.body;

        const create = await createPost(body);
        if(!create) {
            return res.status(404).json({ message: "Unable to create post" });
        }
    
        const users = await getAllUsers();

        if(users?.length > 0) {
            const recepients = users.map((user) => user?.contact || '');
            const messages = create?.title + " \n " + create?.description;

            try {
                await Promise.all(recepients.map((recipient) => sentTwilioSms(recipient, messages)));   
            } catch(error){
                console.error(error);
            }
        }

        return res.status(200).json(create);
    } catch (err) {
        return res.status(500).json(err);
    }
});

postRoute.post("/update", async (req, res) => {
    try {
        const body = req.body;
        
        const update = await updatePost(Number(body.id), body);

        return res.status(200).json(update);
    } catch (err) {
        return res.status(500).json(err);
    }
});

postRoute.post("/delete", async (req, res) => {
    try {
        const body = req.body;
        
        const update = await deletePost(Number(body.id));

        return res.status(200).json(update);
    } catch (err) {
        return res.status(500).json(err);
    }
});

postRoute.post("/join-event", async (req, res) => {
    try {
        const body = req.body;
        
        const update = await joinEvent(Number(body.id), body.userId as string);

        return res.status(200).json(update);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

export default postRoute;
