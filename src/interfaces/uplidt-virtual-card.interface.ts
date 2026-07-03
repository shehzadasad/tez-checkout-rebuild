export interface IUpliftVirtualCard {
  card_ccv: string;
  card_number: string;
  card_type: string;
  contact: {
    city: string;
    country: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    postal_code: string;
    region: string;
    street_address: string;
  };
  expiration_month: number;
  expiration_year: number;
  name_on_card: string;
}
