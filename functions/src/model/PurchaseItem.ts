import { Product } from './Product'
import { Unity } from './Unity'

export interface PurchaseItem {
  product: Product
  unity: Unity
  unityValue: number
  units: number
  totalValue: number
  discount: number
}
