export const validUPCs = ['5949100050'] as const

export type Shipment = {
  shipmentId: string
  UPC: typeof validUPCs[number]
  orderTime: Date
  numOrdered: number
  isSpecialOrder?: boolean
  hasShipped?: boolean
}
