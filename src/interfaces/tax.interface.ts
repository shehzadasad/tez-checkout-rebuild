export interface ITax {
  id: number;
  userId: number;
  title: string;
  description: string;
  country: string;
  states: string[];
  cities: string[];
  taxFlatRate: number;
  taxPercentage: number;
  isActive: boolean;
}
