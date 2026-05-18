import jwt from "jsonwebtoken";
const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
export const generateAccessToken = (id) => {
    return jwt.sign({ id }, accessSecret, {
        expiresIn: "45m",
    });
};
export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, refreshSecret, {
        expiresIn: "7d",
    });
};
