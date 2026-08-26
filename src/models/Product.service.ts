import { ProductStatus } from "../libs/enums/product.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";

class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = ProductModel;
    }

   public async createProduct(input: ProductInput): Promise<Product>{
    try {
    const result = await this.productModel.create(input);
     return result;
    } catch (err) {
        console.log("Error, createProduct:", err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED );
    }
   }

   public async getAllProducts(): Promise<Product[]> {
     const result = await this.productModel.find({
     productStatus: ProductStatus.PROCESS,
     });
     if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
     return result;
   }

   public async getProduct(productId: string): Promise<Product> {
    const result = await this.productModel.findById(productId);

    if(!result) {
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result;
   }
   

}

export default ProductService