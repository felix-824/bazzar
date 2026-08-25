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

}

export default ProductService