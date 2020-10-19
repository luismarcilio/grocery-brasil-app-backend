import { Unity } from './Unity'
import { Company } from './Company'
export interface Product {
  name: string
  eanCode: string
  ncmCode: string
  unity: Unity
  normalized?: boolean
  thumbnail?: string
  normalizationStatus?: number
}

export interface ProductPurchase {
  company: Company
  date: Date
  unityValue: number
}
