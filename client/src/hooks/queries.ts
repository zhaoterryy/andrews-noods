import { gql, useApolloClient } from '@apollo/client'
import { useState } from 'react'
import { Shipment } from '../utils/schema-types'

const GET_SHIPMENTS = gql`
  query Query {
    shipments {
      shipmentId
      UPC
      orderTime
      numOrdered
      isSpecialOrder
      hasShipped
    }
  }
`

export function useGetShipments() {
  const client = useApolloClient()
  const [shipments, setShipments] = useState(new Array<Shipment>())

  client.query({
    query: GET_SHIPMENTS
  }).then(result => {
    setShipments(result?.data?.shipments)
  }).catch(error => {
    console.error(error)
  })

  return { shipments }
}
