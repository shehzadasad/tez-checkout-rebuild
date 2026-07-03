export interface IApiResponse<T> {
  valid: any
  discountValue: any
  success: boolean
  message: string
  data: T
  mulberry_url: any
}
