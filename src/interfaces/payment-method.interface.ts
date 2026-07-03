export interface IPaymentMethod {
  max: number;
  min: number;
  merchant_package_id: number;
  package: {
    package_name: string;
  };
}
