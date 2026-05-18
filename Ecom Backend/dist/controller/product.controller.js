import { uploadImageToCloudinary } from "../services/cloudinary";
import { prisma } from "../lib/prisma";
//search products
export const searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        const product = await prisma.product.findMany({
            where: {
                name: {
                    search: query,
                },
            },
        });
        //console.log(req.file)
        if (product.length === 0) {
            res.status(404).json({ success: false, message: "product not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "product fetched",
            data: product,
        });
    }
    catch (error) {
        const err = error;
        console.log(`Something went wrong while fetching the product`, err);
        res
            .status(500)
            .json({ success: false, message: "Server side error", error: err });
    }
};
//get all products
export const getAllProducts = async (req, res) => {
    try {
        //pagination
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        if (page <= 0) {
            page = 1;
        }
        if (limit <= 0 || limit > 100) {
            limit = 10;
        }
        const skip = (page - 1) * limit;
        const allProducts = await prisma.product.findMany({
            skip: skip,
            take: limit,
            select: {
                name: true,
                image: true,
                description: true,
                price: true,
                discount: true,
                reviews: true,
                stock: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const totalProductCount = await prisma.product.count();
        const totalPages = Math.ceil(totalProductCount / limit);
        if (allProducts.length < 1) {
            res.status(404).json({ success: false, message: "Products not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "All Products Fetched",
            data: allProducts,
            meta: {
                totalPages,
                currentPage: page,
                limit: limit,
            },
        });
        return;
    }
    catch (error) {
        const err = error;
        console.log(`Something went wrong while fetching products`, err);
        res
            .status(500)
            .json({ success: false, message: "Server side error", error: err });
    }
};
//add image
export const addImage = async (req, res) => {
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
    }
    catch (error) {
        const err = error;
        console.log(`Something went wrong while updating`, err);
        res
            .status(500)
            .json({ success: false, message: "Server side error", error: err });
    }
};
//get all categories
export const getAllCategories = async (req, res) => {
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
                message: "You are not an admin",
            });
            return;
        }
        const categories = await prisma.category.findMany({});
        res.status(201).json({
            success: true,
            message: "Product categories fetched",
            data: categories,
        });
    }
    catch (error) {
        const err = error;
        console.log(`Something went wrong while fetching the product categories`, err);
        res
            .status(500)
            .json({ success: false, message: "Server side error", error: err });
    }
};
//add product
export const addProduct = async (req, res) => {
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
        const { name, description, image, price, stock, discount, categoryId } = req.body;
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
    }
    catch (error) {
        const err = error;
        console.log(`Something went wrong while adding the product`, err);
        res
            .status(500)
            .json({ success: false, message: "Server side error", error: err });
    }
};
//update product
export const updateProduct = async (req, res) => {
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
                id: productId,
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
                id: productId,
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
    }
    catch (error) {
        const err = error;
        console.log(`Something went wrong while updating product`, err);
        res
            .status(500)
            .json({ success: false, message: "Server side error", error: err });
    }
};
//add categories
export const addCategories = async (req, res) => {
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
    }
    catch (error) {
        const err = error;
        console.log(`Something went wrong while creating category`, err);
        res
            .status(500)
            .json({ success: false, message: "Server side error", error: err });
    }
};
// delete product
export const deleteProduct = async (req, res) => {
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
                id: productId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Product deleted",
            data: deletedProduct,
        });
    }
    catch (error) {
        const err = error;
        console.log(`Something went wrong while deleting product`, err);
        res
            .status(500)
            .json({ success: false, message: "Server side error", error: err });
    }
};
