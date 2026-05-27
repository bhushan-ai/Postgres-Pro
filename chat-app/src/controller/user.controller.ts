import jwt from "jsonwebtoken";
import { Context } from "hono";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

//get all users
export const allUsers = async (c: Context): Promise<Response> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
      },
    });

    return c.json(
      {
        success: true,
        message: "Users fetched",
        data: users,
      },
      200,
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while fetching the users`, err);

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};

//create
export const createUser = async (c: Context): Promise<Response> => {
  const { name, email, password } = await c.req.json();
  try {
    if (!name || !email || !password) {
      return c.json(
        {
          success: false,
          message: "All Fields are required",
        },
        400,
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return c.json({ success: false, message: "Email already Exist" }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...safeUser } = newUser;

    return c.json(
      {
        success: true,
        message: "User Registered",
        data: safeUser,
      },
      201,
    );

    // await resend.emails
    //   .send({
    //     from: process.env.EMAIL_USER!,
    //     to: newUser.email,
    //     subject: `Welcome to FitCheck ${newUser.name}`,
    //     html: welcomeEmail,
    //   })
    //   .catch((err) => {
    //     console.error("Mail error:", err);
    //   });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while registering the user`, err);

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};

//login
export const login = async (c: Context): Promise<Response> => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json(
        {
          success: false,
          message: "all fields are required",
        },
        400,
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        401,
      );
    }

    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        401,
      );
    }

    const accessToken = generateAccessToken(user.id as string);
    const refreshToken = generateRefreshToken(user.id as string);

    setCookie(c, "accessToken", accessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    setCookie(c, "refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user;

    return c.json(
      {
        success: true,
        message: "LoggedIn Successfully",
        data: safeUser,
      },
      200,
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while login the user`, err);
    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};

//refresh
export const refresh = async (c: Context): Promise<Response> => {
  try {
    const refreshToken = getCookie(c, "refreshToken");

    if (!refreshToken) {
      return c.json(
        {
          success: false,
          message: "Refresh token not found",
        },
        401,
      );
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as {
        id: string;
      };
    } catch (error) {
      return c.json(
        {
          success: false,
          message: "Invalid Token",
        },
        403,
      );
    }
    const accessToken = generateAccessToken(payload.id);
    const newRefreshToken = generateRefreshToken(payload.id);

    setCookie(c, "accessToken", accessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    setCookie(c, "refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return c.json(
      {
        success: true,
        message: "Refreshed",
      },
      200,
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while refreshing`, err);

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};

//update
export const updateUser = async (c: Context): Promise<Response> => {
  try {
    const { name, email, password } = await c.req.json();
    const userId = c.get("user") as { id: string };

    if (!userId) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: {
        id: userId.id,
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password: hashPass }),
      },
    });

    return c.json({ success: true, message: "user updated", data: user }, 201);
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while updating user`, err);

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};

//logout
export const logout = async (c: Context): Promise<Response> => {
  try {
    deleteCookie(c, "accessToken");
    deleteCookie(c, "refreshToken");
    return c.json({ success: true, message: "logged Out successfully" }, 200);
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while logging out`, err);

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};
