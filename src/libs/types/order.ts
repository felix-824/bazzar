import { ObjectId } from 'mongoose';
import { OrderStatus } from '../enums/order.enum';

//Order DB'dagi umumiy order
export interface Order {
  _id: ObjectId;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
//OrderItem order ichidagi bitta mahsulot
export interface OrderItem {
  _id: ObjectId;
  itemQuantity: number; // nechta mahsulot
  itemPrice: number; // bitta mahsulotning narxi
  orderId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

//OrderItemInput yangi item yaratish uchun input
export interface OrderItemInput {
  itemQuantity: number;
  productId: ObjectId;
  orderId?: ObjectId;
}

//OrderInquiry orderlarni qidirish/filterlash uchun
export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
}

export interface OrderUpdateInput {
  orderStatus: OrderStatus;
}

// Yangi order yaratish uchun input
export interface OrderInput {
  orderItems: OrderItemInput[];
}
