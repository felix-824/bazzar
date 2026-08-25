import express from "express";
import router from "./router";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import memberController from "./controllers/member.controller";

const routerAdmin = express.Router();

routerAdmin.post(
    "/product/create", 
    memberController.verifyAuth,
    memberController.verifyAdmin,
    uploader("products").array("productImages"),
    productController.createProduct);

export default routerAdmin;