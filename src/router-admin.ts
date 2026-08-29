import express from 'express';
import router from './router';
import uploader from './libs/utils/uploader';
import productController from './controllers/product.controller';
import memberController from './controllers/member.controller';
import orderController from './controllers/order.controller';

const routerAdmin = express.Router();

// Admin yangi product yaratadi.
routerAdmin.post(
  '/product/create',
  memberController.verifyAuth,
  memberController.verifyAdmin,
  uploader('products').array('productImages'),
  productController.createProduct,
);

// Admin mavjud product ma'lumotlarini yangilaydi.
routerAdmin.post(
  '/product/update/:id',
  memberController.verifyAuth,
  memberController.verifyAdmin,
  uploader('products').array('productImages'),
  productController.updateProduct,
);

// Admin productni soft delete qiladi.
// Ya'ni DBdan o'chirmaydi, statusini DELETE ga o'zgartiradi.
routerAdmin.post(
  '/product/delete/:id',
  memberController.verifyAuth,
  memberController.verifyAdmin,
  productController.deleteProduct,
);

// Admin barcha userlarning orderlarini ko'radi.
routerAdmin.get(
  '/order/all',
  memberController.verifyAuth,
  memberController.verifyAdmin,
  orderController.getAllOrdersByAdmin,
);

// Admin order statusini boshqaradi.
// Masalan: PAUSE -> PROCESS -> FINISH
routerAdmin.post(
  '/order/update/:id',
  memberController.verifyAuth,
  memberController.verifyAdmin,
  orderController.updateOrderByAdmin,
);

export default routerAdmin;
