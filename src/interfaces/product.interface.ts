export interface IProduct {
  id: string;
  src: string;
  sku: string;
  name: string;
  type: string;
  quantity: number;
  category: string | null;
  subcategory: string;
  description: string;
  color: string;
  size: string;
  brand: string;
  unit_price: number;
  amount: 2100;
  attributes: Array<{
    attribute_size: string;
    variation_id: string;
  }>;
  tax_rate: number;
  total_discount_amount: number;
  total_tax_amount: number;
  shipping_attributes: {
    weight: string;
    dimensions: {
      height: string;
      width: string;
      length: string;
    };
  };
}
