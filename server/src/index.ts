import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.route";
import morgan from "morgan"
import { verifyToken } from "./utils/token";
import reactionRoute from "./routes/reaction.route";
import postRoute from "./routes/post.route";
import userRoute from "./routes/user.route";
import commentRoute from "./routes/comment.route";

dotenv.config();

const port = "4000";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"))

const mainRouter = express.Router()

mainRouter.use((req: Request, res: Response, next: NextFunction) => {
    // Get the token from the request header
    const auth = req.headers['authorization'];
    const split = auth?.split(" ")
    const token = split?.[1]

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    try {
        // Verify token
        verifyToken(token);

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
});

app.use('/uploads', express.static(__dirname + '/uploads/'));

app.use("/auth", authRoute)
app.use("/api", mainRouter)

mainRouter.use("/reactions", reactionRoute);
mainRouter.use("/posts", postRoute);
mainRouter.use("/users", userRoute);
mainRouter.use("/comments", commentRoute);


app.listen(port, () => {
	console.log(`Server is running in port ${port}`);
});
