interface ICardFields {
  fields: {
    card_holder_name: string
    card_number: string
    cvv: string
    expiry_month: string
    expiry_year: string
  }
}
export interface ITokenizeCard {
  quorum: boolean
  records: ICardFields[]
  tokenization: boolean
}

interface ICardResponse {
  skyflow_id: string
  tokens: {
    card_holder_name: string
    card_number: string
    cvv: string
    expiry_month: string
    expiry_year: string
  }
}

export interface ITokenizeCardResponse {
  records: ICardResponse[]
}
