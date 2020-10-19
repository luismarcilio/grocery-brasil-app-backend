/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Company } from './Company'

export interface FiscalNote {
  accessKey: string
  number: string
  series: string
  company: Company
  date: Date
}
