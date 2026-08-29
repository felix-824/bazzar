import { Response } from "express";
import OrderService from "../models/Order.service";
import { ExtendedRequest } from "../libs/types/member";
import { OrderInput } from "../libs/types/order";
import Errors, { HttpCode, Message } from "../libs/Errors";

const orderController: any = {};
const orderService = new OrderService();

orderController.createOrder = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    console.log("createOrder");

    const memberId = req.member._id;
    const input: OrderInput = req.body;

    const result = await orderService.createOrder(memberId, input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error, createOrder:", err);

    if (err instanceof Errors) {
      res.status(err.code).json({ message: err.message });
    } else {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        message: Message.SOMETHING_WENT_WRONG,
      });
    }
  }
};

export default orderController;