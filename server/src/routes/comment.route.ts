import express from "express"
import { createComment } from "../services/comment.service";

const commentRoute = express.Router();

commentRoute.post("/create", async (req, res) => {
    try {
        const body = req.body;

        const create = await createComment(body);

        return res.status(200).json(create);
    } catch (err) {
        return res.status(500).json(err);
    }
});

export default commentRoute;
