import express from "express";
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
const router = express.Router();

router.post("/member/signup", memberController.signup);

router.post("/member/login", memberController.login);

router.post(
    "/member/logout",
     memberController.verifyAuth,
     memberController.logout);

router.get(
    "/member/detail",
    memberController.verifyAuth,
    memberController.getMemberDetail
);     
router.post(
    "/member/update",
    memberController.verifyAuth,
    uploader("members").single("memberImage"),
    memberController.updateMember
);


router.get(
    "/products/",
    productController.getProducts
);

router.get(
    "/product/:id",
    productController.getProduct
);

router.post(
    "/order/create",
    memberController.verifyAuth,
    orderController.createOrder
);

export default router;