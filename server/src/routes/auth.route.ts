import express from "express"
import { createUser, getUserByUsername } from "../services/auth.service";
import { signToken } from "../utils/token";

const authRoute = express.Router();

authRoute.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: "Invalid username" });
        }

        if(user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }  
        
        if(!user.isApproved){
            return res.status(401).json({ message: "Account was not been approved yet" });
        }

        const payload = {
            id: user.id,
            username: user.username,
            created: new Date(),
        };

        const token = signToken(payload);
        console.log("token", token);

        return res.status(200).json({ user, token })
    } catch (err) {
        return res.status(500).json(err);
    }
});

authRoute.post("/register", async (req, res) => {
    try {
        const body = req.body;

        const user = await getUserByUsername(body.username);

        if (user) {
            return res.status(400).json({ message: "Username is not available" });
        }

        const create = await createUser(body);

        return res.status(200).json(create);
    } catch (err) {
        return res.status(500).json(err);
    }
});

export default authRoute;
