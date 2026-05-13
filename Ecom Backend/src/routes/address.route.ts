import express from "express";

import { jwtMiddleware } from "../middleware/jwtAuth";
import { addCustomerAddress } from "../controller/address.controller";

const addressRouter = express.Router();

addressRouter.post("/add-address", jwtMiddleware, addCustomerAddress);

export default addressRouter;
