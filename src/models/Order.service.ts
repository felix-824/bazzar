import { ObjectId } from "mongoose";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { Order, OrderInput } from "../libs/types/order";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }

  public async createOrder(
    memberId:  string,
    input: OrderInput
  ): Promise<Order> {

    const orderTotal = input.orderItems.reduce(
      (total, item) => total + item.itemPrice * item.itemQuantity,
      0
    );

    const order = await this.orderModel.create({
      orderTotal,
      orderDelivery: input.orderDelivery,
      memberId,
    });

    const orderItems = input.orderItems.map((item) => ({
      ...item,
      orderId: order._id,
    }));

    await this.orderItemModel.insertMany(orderItems);

    return order;
  }
}

export default OrderService;