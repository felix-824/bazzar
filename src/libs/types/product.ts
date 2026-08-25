
import { ObjectId } from "mongoose";
import {
  ProductCollection,
  ProductStatus,
  ProductUnit,
} from "../enums/product.enum";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productUnit: ProductUnit;
  productVolume: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productUnit: ProductUnit;
  productVolume: number;
  productDesc?: string;
  productImages?: string[];
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productName?: string;
  productPrice?: number;
  productLeftCount?: number;
  productUnit?: ProductUnit;
  productVolume?: number;
  productDesc?: string;
  productImages?: string[];
}