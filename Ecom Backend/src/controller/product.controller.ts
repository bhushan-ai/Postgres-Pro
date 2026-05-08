import { Request, Response } from "express";
import { uploadImageToCloudinary } from "../services/cloudinary";

//add image
export const addImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(404).json({ success: false, message: "Image not found" });
      return;
    }

    const bufferFile = req.file;
    const b64 = Buffer.from(bufferFile.buffer).toString("base64");
    const url = `data:${bufferFile.mimetype};base64,${b64}`;
    const imgUrl = await uploadImageToCloudinary(url);

    if (imgUrl === null) {
      res.status(404).json({
        success: false,
        message: "Image url not created",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Image url created",
      url: imgUrl?.secure_url,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while updating`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {};
