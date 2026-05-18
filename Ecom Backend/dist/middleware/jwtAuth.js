import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
const accessSecret = process.env.ACCESS_SECRET;
export const jwtMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, accessSecret);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });
        req.user = user;
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid token", error });
    }
};
