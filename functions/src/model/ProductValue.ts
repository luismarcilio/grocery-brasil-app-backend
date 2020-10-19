import { Company } from './Company'
import { Product } from './Product'

export interface ProductValue {
  company: Company
  product: Product
  date: Date
  value: number
}
