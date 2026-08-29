import express from "express";
import router from "./router";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import memberController from "./controllers/member.controller";
import orderController from "./controllers/order.controller";

const routerAdmin = express.Router();

routerAdmin.post(
    "/product/create", 
    memberController.verifyAuth,
    memberController.verifyAdmin,
    uploader("products").array("productImages"),
    productController.createProduct);

routerAdmin.post(
    "/product/update/:id",
    memberController.verifyAuth,
    memberController.verifyAdmin,
    uploader("products").array("productImages"),
    productController.updateProduct
)    
routerAdmin.post(
    "/product/delete/:id",
    memberController.verifyAuth,
    memberController.verifyAdmin,
    productController.deleteProduct
);

routerAdmin.post(
  "/order/update/:id",
  memberController.verifyAuth,
  memberController.verifyAdmin,
  orderController.updateOrderByAdmin
);

export default routerAdmin;