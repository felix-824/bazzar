import { ObjectId } from "mongoose";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { Order, OrderInput, OrderInquiry,  OrderUpdateInput, } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { OrderStatus } from "../libs/enums/order.enum";


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

   public async getOrders(
  memberId: string,
  inquiry: OrderInquiry
): Promise<Order[]> {
  const memberObjectId = shapeIntoMongooseObjectId(memberId);

  const match: any = {
    memberId: memberObjectId,
  };

  if (inquiry.orderStatus) {
    match.orderStatus = inquiry.orderStatus;
  }

  const result = await this.orderModel
    .aggregate([
      {
        $match: match,
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $skip: (inquiry.page - 1) * inquiry.limit,
      },
      {
        $limit: inquiry.limit,
      },
      {
        $lookup: {
          from: "orderItems",
          localField: "_id",
          foreignField: "orderId",
          as: "orderItems",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productData",
        },
      },
    ])
    .exec();

  return result;
}

public async updateOrderByAdmin(
  orderId: string,
  input: OrderUpdateInput
): Promise<Order> {
  const orderObjectId = shapeIntoMongooseObjectId(orderId);

  const order = await this.orderModel.findById(orderObjectId);

  if (!order) {
    throw new Errors(
      HttpCode.NOT_FOUND,
      Message.NO_DATA_FOUND
    );
  }

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PAUSE]: [OrderStatus.PROCESS],
    [OrderStatus.PROCESS]: [OrderStatus.FINISH],
    [OrderStatus.FINISH]: [],
    [OrderStatus.DELETE]: [],
  };

  const nextStatus = input.orderStatus;

  if (
    !Object.values(OrderStatus).includes(nextStatus) ||
    !allowedTransitions[
      order.orderStatus as OrderStatus
    ].includes(nextStatus)
  ) {
    throw new Errors(
      HttpCode.BAD_REQUEST,
      Message.UPDATE_FAILED
    );
  }

  order.orderStatus = nextStatus;

  await order.save();

  return order;
}

public async cancelOrder(
  memberId: string,
  orderId: string
):Promise<Order>{
  const memberObjectId = shapeIntoMongooseObjectId(memberId);
  const orderObjectId = shapeIntoMongooseObjectId(orderId);

  const result = await this.orderModel.findOneAndUpdate(
    {
      _id: orderObjectId,
      memberId: memberObjectId,
      orderStatus: OrderStatus.PAUSE,
    },
    {
      orderStatus: OrderStatus.DELETE,
    },
    {
      new: true,
    }
  );
  if (!result) {throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED

  );
}

return result;
}

}

export default OrderService;