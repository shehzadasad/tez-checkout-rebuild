export interface IShippingDetail {
  id: number
  userId: number
  cost: number
  fee: number
  title: string
  description: string
  country: string
  states: string[]
  cities: string[]
  shippingFlatFee: number
  shippingPercentFee: number
  isActive: boolean
  minAmount: number
  maxAmount: number
}
