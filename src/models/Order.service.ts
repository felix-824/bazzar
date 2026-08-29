import { ObjectId } from 'mongoose';
import OrderModel from '../schema/Order.model';
import OrderItemModel from '../schema/OrderItem.model';
import { Order, OrderInput, OrderInquiry, OrderUpdateInput } from '../libs/types/order';
import { shapeIntoMongooseObjectId } from '../libs/config';
import Errors, { HttpCode, Message } from '../libs/Errors';
import { OrderStatus } from '../libs/enums/order.enum';
import ProductModel from '../schema/Product.model';
import { ProductStatus } from '../libs/enums/product.enum';

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly productModel;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.productModel = ProductModel;
  }

  public async createOrder(memberId: string, input: OrderInput): Promise<Order> {
    // 1. Frontenddan orderItems kelganini tekshiramiz.
    // Agar savat bo'sh bo'lsa, order yaratmaymiz.
    if (!input.orderItems || input.orderItems.length === 0) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }

    // 2. Tekshirilgan order itemlarni vaqtincha shu arrayga yig'amiz.
    // Keyin ularni OrderItem collectionga saqlaymiz.
    const preparedItems = [];

    // 3. Mahsulotlarning umumiy narxini hisoblash uchun.
    // Boshlanishida total = 0.
    let orderTotal = 0;

    // 4. Frontend yuborgan har bir mahsulotni bittadan tekshiramiz.
    for (const item of input.orderItems) {
      // 5. Mahsulot soni 0 yoki minus bo'lishi mumkin emas.
      if (item.itemQuantity <= 0) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }

      // 6. Frontenddan kelgan productId ni
      // MongoDB ObjectId formatiga o'tkazamiz.
      const productId = shapeIntoMongooseObjectId(item.productId);

      // 7. Productni database'dan topamiz.
      // Faqat PROCESS holatidagi productni olish mumkin.
      const product = await this.productModel.findOne({
        _id: productId,
        productStatus: ProductStatus.PROCESS,
      });

      // 8. Product topilmasa order yaratishni to'xtatamiz.
      if (!product) {
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
      }

      // 9. Omborda yetarli mahsulot borligini tekshiramiz.
      // Masalan: omborda 3 ta bo'lsa, user 5 ta ola olmaydi.
      if (product.productLeftCount < item.itemQuantity) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }

      // 10. Sotib olinayotgan miqdorni ombordagi mahsulotdan ayiramiz.
      // Masalan: 31 - 2 = 29.
      product.productLeftCount -= item.itemQuantity;

      // 11. Yangilangan productLeftCount ni database'ga saqlaymiz.
      await product.save();

      // 12. Product narxini FRONTENDDAN emas, DATABASEDAN olamiz.
      // Narx × sonini orderTotal ga qo'shib boramiz.
      // Masalan: 4001 × 2 = 8002.
      orderTotal += product.productPrice * item.itemQuantity;

      // 13. Tekshirilgan mahsulotni preparedItems ga qo'shamiz.
      // itemPrice ham database'dagi haqiqiy productPrice'dan olinadi.
      preparedItems.push({
        productId: product._id,
        itemQuantity: item.itemQuantity,
        itemPrice: product.productPrice,
      });
    } // 14. for loop shu yerda tugaydi.

    // 15. Yetkazib berish narxini backend belgilaydi.
    // Frontend delivery narxini o'zi yubormaydi.
    const orderDelivery = 3000;

    // 16. Asosiy Order documentini yaratamiz.
    // orderTotal = mahsulotlar jami + delivery.
    const order = await this.orderModel.create({
      orderTotal: orderTotal + orderDelivery,
      orderDelivery,
      memberId: shapeIntoMongooseObjectId(memberId),
    });

    // 17. Har bir OrderItemga yangi yaratilgan
    // Orderning _id sini orderId sifatida biriktiramiz.
    const orderItems = preparedItems.map((item) => ({
      ...item,
      orderId: order._id,
    }));

    // 18. Barcha OrderItemlarni database'ga bir vaqtda saqlaymiz.
    await this.orderItemModel.insertMany(orderItems);

    // 19. Yaratilgan Orderni controllerga qaytaramiz.
    return order;
  }

  public async getOrders(memberId: string, inquiry: OrderInquiry): Promise<Order[]> {
    // 1. Login qilgan userning memberId sini
    // MongoDB ObjectId formatiga o'tkazamiz.
    const memberObjectId = shapeIntoMongooseObjectId(memberId);

    // 2. MongoDBda qidirish uchun filter tayyorlaymiz.
    // Faqat shu userga tegishli orderlar olinadi.
    const match: any = {
      memberId: memberObjectId,
    };

    // 3. Agar frontend orderStatus yuborsa,
    // qidiruvga status filterini ham qo'shamiz.
    // Masalan: faqat PAUSE yoki faqat FINISH orderlar.
    if (inquiry.orderStatus) {
      match.orderStatus = inquiry.orderStatus;
    }

    // 4. Orderlarni MongoDB aggregation orqali olamiz.
    const result = await this.orderModel
      .aggregate([
        // 5. Yuqorida tayyorlangan match bo'yicha orderlarni filterlaymiz.
        // Ya'ni shu userning orderlari va agar berilgan bo'lsa status bo'yicha.
        {
          $match: match,
        },

        // 6. Orderlarni updatedAt bo'yicha tartiblaymiz.
        // -1 = eng yangi yangilangan order birinchi chiqadi.
        {
          $sort: {
            updatedAt: -1,
          },
        },

        // 7. Pagination uchun oldingi sahifadagi orderlarni tashlab o'tamiz.
        // Masalan: page = 2, limit = 10 bo'lsa:
        // (2 - 1) * 10 = 10 ta orderni skip qiladi.
        {
          $skip: (inquiry.page - 1) * inquiry.limit,
        },

        // 8. Bitta sahifada nechta order qaytishini belgilaymiz.
        // Masalan limit = 10 bo'lsa, maksimum 10 ta order qaytadi.
        {
          $limit: inquiry.limit,
        },

        // 9. Har bir Orderga tegishli OrderItemlarni topamiz.
        // orders._id bilan orderItems.orderId ni solishtiradi.
        {
          $lookup: {
            from: 'orderItems',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderItems',
          },
        },

        // 10. OrderItem ichidagi productId lar orqali
        // products collectiondan mahsulot ma'lumotlarini olamiz.
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.productId',
            foreignField: '_id',
            as: 'productData',
          },
        },
      ])

      // 11. Aggregation queryni MongoDBda ishga tushiramiz.
      .exec();

    // 12. Topilgan orderlarni Controllerga qaytaramiz.
    return result;
  }

  public async getAllOrdersByAdmin(inquiry: OrderInquiry): Promise<Order[]> {
    // 1. Orderlarni filterlash uchun bo'sh match object yaratamiz.
    // Admin barcha userlarning orderlarini ko'ra oladi,
    // shuning uchun bu yerda memberId yo'q.
    const match: any = {};

    // 2. Agar admin orderStatus yuborsa,
    // faqat shu statusdagi orderlarni olamiz.
    // Masalan: PAUSE, PROCESS yoki FINISH.
    if (inquiry.orderStatus) {
      match.orderStatus = inquiry.orderStatus;
    }

    // 3. Orderlarni MongoDB aggregation orqali olamiz.
    const result = await this.orderModel
      .aggregate([
        // 4. Status bo'yicha filterlaymiz.
        // Agar orderStatus yuborilmagan bo'lsa,
        // match bo'sh bo'ladi va barcha orderlar olinadi.
        {
          $match: match,
        },

        // 5. Eng yangi yangilangan orderlarni
        // birinchi qilib chiqaramiz.
        {
          $sort: {
            updatedAt: -1,
          },
        },

        // 6. Pagination:
        // oldingi sahifadagi orderlarni tashlab o'tamiz.
        {
          $skip: (inquiry.page - 1) * inquiry.limit,
        },

        // 7. Bir sahifada nechta order chiqishini belgilaymiz.
        {
          $limit: inquiry.limit,
        },

        // 8. Har bir orderga tegishli OrderItemlarni qo'shamiz.
        {
          $lookup: {
            from: 'orderItems',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderItems',
          },
        },

        // 9. OrderItemlardagi productId orqali
        // Product ma'lumotlarini ham qo'shamiz.
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.productId',
            foreignField: '_id',
            as: 'productData',
          },
        },

        // 10. Orderni qilgan userning ma'lumotlarini ham olamiz.
        // orders.memberId bilan members._id bog'lanadi.
        {
          $lookup: {
            from: 'members',
            localField: 'memberId',
            foreignField: '_id',
            as: 'memberData',
          },
        },

         // Member password hashini frontendga yubormaymiz.
        {
          $project: {
            'memberData.memberPassword': 0,
          },
        },
      ])
      .exec();

    // 11. Topilgan barcha orderlarni Controllerga qaytaramiz.
    return result;
  }

  public async updateOrderByAdmin(orderId: string, input: OrderUpdateInput): Promise<Order> {
    // 1. Router/Controllerdan kelgan orderId ni
    // MongoDB ObjectId formatiga o'tkazamiz.
    const orderObjectId = shapeIntoMongooseObjectId(orderId);

    // 2. Shu _id bo'yicha Orderni database'dan qidiramiz.
    const order = await this.orderModel.findById(orderObjectId);

    // 3. Agar bunday Order topilmasa xatolik qaytaramiz.
    if (!order) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    // 4. Order status qaysi statusdan qaysi statusga
    // o'tishi mumkinligini belgilaymiz.
    //
    // PAUSE   -> PROCESS mumkin
    // PROCESS -> FINISH mumkin
    // FINISH  -> boshqa statusga o'tmaydi
    // DELETE  -> boshqa statusga o'tmaydi
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PAUSE]: [OrderStatus.PROCESS],
      [OrderStatus.PROCESS]: [OrderStatus.FINISH],
      [OrderStatus.FINISH]: [],
      [OrderStatus.DELETE]: [],
    };

    // 5. Admin yuborgan yangi orderStatusni olamiz.
    // Masalan input.orderStatus = PROCESS.
    const nextStatus = input.orderStatus;

    // 6. Yangi statusni tekshiramiz:
    //
    // Birinchi shart:
    // nextStatus OrderStatus enum ichida mavjudmi?
    //
    // Ikkinchi shart:
    // Hozirgi statusdan nextStatusga o'tishga ruxsat bormi?
    //
    // Masalan:
    // PAUSE -> PROCESS  ✅
    // PAUSE -> FINISH   ❌
    // FINISH -> PROCESS ❌
    if (
      !Object.values(OrderStatus).includes(nextStatus) ||
      !allowedTransitions[order.orderStatus as OrderStatus].includes(nextStatus)
    ) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);
    }

    // 7. Tekshiruvlardan o'tgan bo'lsa,
    // Orderning eski statusini yangi statusga almashtiramiz.
    //
    // Masalan:
    // PAUSE -> PROCESS
    order.orderStatus = nextStatus;

    // 8. O'zgargan Orderni database'ga saqlaymiz.
    await order.save();

    // 9. Yangilangan Orderni Controllerga qaytaramiz.
    return order;
  }

  public async cancelOrder(memberId: string, orderId: string): Promise<Order> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);

    // 2. Bekor qilinadigan orderId ni ham
    // MongoDB ObjectId formatiga o'tkazamiz.
    const orderObjectId = shapeIntoMongooseObjectId(orderId);

    // 3. Database'dan orderni topamiz va statusini yangilaymiz.
    const result = await this.orderModel.findOneAndUpdate(
      // 4. Orderni topish uchun 3 ta shartni tekshiramiz:
      // - _id shu orderId bo'lishi kerak
      // - memberId login qilgan userniki bo'lishi kerak
      // - orderStatus faqat PAUSE bo'lishi kerak
      {
        _id: orderObjectId,
        memberId: memberObjectId,
        orderStatus: OrderStatus.PAUSE,
      },

      // 5. Yuqoridagi shartlarga mos Order topilsa,
      // uning statusini DELETE ga o'zgartiramiz.
      // Ya'ni orderni DBdan o'chirmaymiz, bekor qilingan deb belgilaymiz.
      {
        orderStatus: OrderStatus.DELETE,
      },

      // 6. new: true yangi, ya'ni statusi o'zgargan
      // Orderni result sifatida qaytaradi.
      {
        new: true,
      },
    );

    // 7. Agar mos Order topilmasa result null bo'ladi.
    // Masalan:
    // - order boshqa userniki bo'lsa
    // - order PROCESS bo'lsa
    // - order FINISH bo'lsa
    // - order allaqachon DELETE bo'lsa
    // shunda xatolik qaytaramiz.
    if (!result) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);
    }

    // 8. Statusi DELETE ga o'zgargan Orderni
    // Controllerga qaytaramiz.
    return result;
  }
}

export default OrderService;
