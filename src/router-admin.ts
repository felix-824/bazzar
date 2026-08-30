import express from 'express';
import router from './router';
import uploader from './libs/utils/uploader';
import productController from './controllers/product.controller';
import memberController from './controllers/member.controller';
import orderController from './controllers/order.controller';
import adminController from "./controllers/admin.controller";

const routerAdmin = express.Router();


/// Admin EJS panel orqali yangi product yaratadi.
routerAdmin.post(
  '/product/create',
  adminController.verifyAdminSession,
  uploader('products').array('productImages'),
  adminController.createProduct,
);

// Admin EJS panel orqali productni yangilaydi.
routerAdmin.post(
  '/product/update/:id',
  adminController.verifyAdminSession,
  uploader('products').array('productImages'),
  adminController.updateProduct,
);

// Admin productni soft delete qiladi.
// Ya'ni DBdan o'chirmaydi, statusini DELETE ga o'zgartiradi.
routerAdmin.post(
    "/product/delete/:id",
    adminController.verifyAdminSession,
    adminController.deleteProduct
);

// Admin barcha userlarning orderlarini ko'radi.
routerAdmin.get(
    "/order/all",
    adminController.verifyAdminSession,
    adminController.getOrders
);

// Admin order statusini boshqaradi.
// Masalan: PAUSE -> PROCESS -> FINISH
routerAdmin.post(
    "/order/update/:id",
    adminController.verifyAdminSession,
    adminController.updateOrder
);


routerAdmin.get(
    "/",
    adminController.verifyAdminSession,
    adminController.goHome
);

routerAdmin.get(
    "/login",
    adminController.getLogin
);

routerAdmin.post(
    "/login",
    adminController.processLogin
);

routerAdmin.get(
    "/logout",
    adminController.logout
);

// Admin barcha productlarni EJS sahifada ko'radi.
routerAdmin.get(
  "/product/all",
  adminController.verifyAdminSession,
  adminController.getProducts
);

export default routerAdmin;
