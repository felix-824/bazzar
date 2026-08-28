import { ProductCollection, ProductStatus } from '../libs/enums/product.enum';
import Errors, { HttpCode, Message } from '../libs/Errors';
import { T } from '../libs/types/common';
import { Product, ProductInput, ProductInquiry, ProductUpdateInput } from '../libs/types/product';
import ProductModel from '../schema/Product.model';

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  public async createProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      return result;
    } catch (err) {
      console.log('Error, createProduct:', err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    const match: any = {
      productStatus: ProductStatus.PROCESS,
    };
    if (input.productCollection) {
      match.productCollection = input.productCollection;
    }
    if (input.search) {
      match.productName = {
        $regex: input.search,  // productName ichidan searchdagi so'zni qidiradi =.search=MILK
        $options: 'i',        // katta-kichik harfni farqlamaydi 
      };
    }
    const { page = 1, limit = 10 } = input;

    const skip = (page - 1) * limit;

    let sortOption: T = {createdAt: -1 };
    if (input.sort === 'price_low') {
        sortOption ={ productPrice: 1 };
    }else if (input.sort === 'price_high') {
        sortOption = { productPrice: -1};
    }

    const result = await this.productModel
    .find(match)   //shartlarga mos productlarni top
    .sort(sortOption)    
    .skip(skip)  //.skip(raqam 5) birinchi (raqam 1 yoki 5) tasini o'tkaz
    .limit(limit) //.limit(raqam 5) keyingi (raqam 5) tasini ol
    .exec();  //queryni bajar
    

    if (!result.length) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async getProduct(productId: string): Promise<Product> {
    const result = await this.productModel.findById(productId);

    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    return result;
  }

  public async updateProduct(productId: string, input: ProductUpdateInput): Promise<Product> {
    const result = await this.productModel.findByIdAndUpdate(productId, input, { new: true });

    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    return result;
  }
}

export default ProductService;
