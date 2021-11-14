export const validUPCs = ['5949100050', '089686170726', '031146007400', '031146150304', '648436100590', 'B075VM9N96'] as const
export type ValidUPC = typeof validUPCs[number]

export type Shipment = {
  shipmentId: string
  UPC: ValidUPC
  orderTime: Date
  numOrdered: number
  isSpecialOrder?: boolean
  hasShipped?: boolean
}
