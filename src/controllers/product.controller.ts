import Errors, { HttpCode } from '../libs/Errors';
import { ProductInput, ProductUpdateInput } from '../libs/types/product';
import ProductService from '../models/Product.service';
import { Request, Response } from 'express';

const productController: any = {};
const productService = new ProductService();

productController.createProduct = async (req: Request, res: Response) => {
  try {
    const input: ProductInput = req.body;
    console.log('PRODUCT INPUT =>', input);

    if (req.files) {
      const files = req.files as Express.Multer.File[];

      input.productImages = files.map((file) => file.path.replace(/\\/g, '/'));
    }

    const result = await productService.createProduct(input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await productService.getAllProducts();

    console.log('Natija', result);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

productController.getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as string;

    console.log('productId', productId);

    const result = await productService.getProduct(productId);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

productController.updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as string;
    const input: ProductUpdateInput = req.body;

     if (req.files) {
      const files = req.files as Express.Multer.File[];

      input.productImages = files.map((file) =>
        file.path.replace(/\\/g, "/")
      );
    }

    console.log('IdResult', productId);
    console.log('ProductResult', input);

    const result = await productService.updateProduct(productId, input);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    if(err instanceof Errors) {
        res.status(err.code).json(err);
    }else{
        res.status(Errors.standard.code).json(Errors.standard)
    }
  }
};

export default productController;
