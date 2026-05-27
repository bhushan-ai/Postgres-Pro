import { Next } from "./../../node_modules/hono/dist/types/types.d";
import { Context } from "hono";
import jwt from "jsonwebtoken";
import { getCookie } from "hono/cookie";
import { prisma } from "../lib/prisma";
const secret = process.env.SECRET as string;

//auth
export const jwtAuth = async (c: Context, next: Next) => {
  try {
    const token = getCookie(c, "accessToken");
    if (!token) {
      return c.json({ success: true, message: "token not found" }, 400);
    }

    const decodedToken = jwt.verify(token, secret) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });
    if (!user) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    c.set("user", user);

    await next();
  } catch (error: unknown) {
    console.log("Auth error", error);

    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401,
    );
  }
};
