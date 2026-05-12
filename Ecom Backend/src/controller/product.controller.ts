import { Request, Response } from "express";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { prisma } from "../lib/prisma";

//add image
export const addImage = async (req: Request, res: Response): Promise<void> => {
  try {
    //console.log(req.file)
    if (!req.file) {
      res.status(404).json({ success: false, message: "Image not found" });
      return;
    }

    const bufferFile = req.file;
    const b64 = Buffer.from(bufferFile.buffer).toString("base64");
    const url = `data:${bufferFile.mimetype};base64,${b64}`;
    const imgUrl = await uploadImageToCloudinary(url);

    //console.log(imgUrl)
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

//get all products
export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const allProducts = await prisma.product.findMany();
    if (allProducts.length < 1) {
      res.status(404).json({ success: false, message: "Products not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "All Products Fetched",
      products: allProducts.length,
      data: allProducts,
    });
    return;
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while fetching products`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//add product
export const addProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // check user is admin or not
    if (!req.user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    //check user id
    const userId = req.user.id;
    if (!userId) {
      res.status(404).json({ success: false, message: "User Id not found" });
    }

    //find user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found in Db" });
      return;
    }

    if (user?.role !== "ADMIN") {
      res.status(404).json({
        success: false,
        message: "You can not add the product because you are not admin",
      });
      return;
    }

    // add product
    const { name, description, image, price, stock, discount, categoryId } =
      req.body;

    if (!name || !description || !image || !price || !stock) {
      res.status(400).json({
        success: false,
        message: "All info required",
      });
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        image,
        price,
        stock,
        discount,
        categoryId,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Product added", data: newProduct });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while adding the product`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//update product
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // check user is admin or not
    if (!req.user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    //check user id
    const userId = req.user.id;
    if (!userId) {
      res.status(404).json({ success: false, message: "User Id not found" });
    }

    //find user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found in Db" });
      return;
    }

    if (user?.role !== "ADMIN") {
      res.status(403).json({
        success: false,
        message: "You can not add the product because you are not admin",
      });
      return;
    }

    const { productId } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId as string,
      },
    });

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    const { name, description, image, price, stock, discount } = req.body;

    const product = await prisma.product.update({
      where: {
        id: productId as string,
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(image && { image }),
        ...(price && { stock }),
        ...(stock && { stock }),
        ...(discount && { discount }),
      },
    });
    res
      .status(201)
      .json({ success: true, message: "product updated", data: product });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while updating product`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//add categories
export const addCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // check user is admin or not
    if (!req.user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    //check user id
    const userId = req.user.id;
    if (!userId) {
      res.status(404).json({ success: false, message: "User Id not found" });
    }

    //find user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found in Db" });
      return;
    }

    if (user?.role !== "ADMIN") {
      res.status(404).json({
        success: false,
        message: "You can not add the product because you are not admin",
      });
      return;
    }

    //adding category
    const { name, slug, description } = req.body;
    if (!name || !slug || !description) {
      res.status(400).json({
        success: false,
        message: "All info required",
      });
      return;
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name,
        slug: slug,
        description: description,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Category Created", data: newCategory });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while creating category`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// delete product
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // check user is admin or not
    if (!req.user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    //check user id
    const userId = req.user.id;
    if (!userId) {
      res.status(404).json({ success: false, message: "User Id not found" });
    }

    //find user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found in Db" });
      return;
    }

    if (user?.role !== "ADMIN") {
      res.status(404).json({
        success: false,
        message: "You can not add the product because you are not admin",
      });
      return;
    }

    //deleting product
    const productId = req.params.id;
    if (!productId) {
      res.status(400).json({
        success: false,
        message: "productId required",
      });
      return;
    }

    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId as string,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted",
      data: deletedProduct,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while deleting product`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
