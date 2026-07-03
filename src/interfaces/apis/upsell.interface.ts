import { IProduct } from "../product.interface";
import { IShippingMethod } from "../shipping-method.interface";
import { IShipping } from "../shipping.interface";

export interface IProductInfo {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  vendor: string;
  image: string;
  has_variants: string;
  merchant_product_id: string;
  merchant_user_id: number;
  price?: number;
}

export interface IProductImage {
  id: number;
  image_url: string;
  product_id: number;
  merchant_user_id: number;
}
export interface IProductVariant {
  id: number;
  merchant_variant_id: string;
  sku: string;
  available: string;
  variant_attributes: string[];
  featured_image: string;
  price: number;
  sale_price: number;
  available_stock: number;
  product_id: number;
  merchant_user_id: number;
}

export interface IProductAttributes {
  id: number;
  name: string;
  position: number;
  attribute_options: string[];
  product_id: number;
  merchant_user_id: number;
}

export interface IUpSellResponse {
  product_info: IProductInfo;
  product_variants: IProductVariant[];
  product_images: IProductImage[];
  product_attributes: IProductAttributes[];
  product_tags: string[];
}
