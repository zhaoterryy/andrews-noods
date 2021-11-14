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
      hasNotShipped
    }
  }
`

const GET_SHIPMENTS_OF_UPC = gql`
  query ShipmentsOfUPC($UPC: String!) {
    shipmentsOfUPC(UPC: $UPC) {
      shipmentId
      UPC
      orderTime
      numOrdered
      isSpecialOrder
      hasNotShipped
    }
  }
`

export function useGetAllShipments() {
  const client = useApolloClient()
  const [shipments, setShipments] = useState(new Array<Shipment>())

  const getAllShipments = async () => {
    try {
      const result = await client.query({
        query: GET_SHIPMENTS,
        fetchPolicy: 'network-only'
      })
      setShipments(result?.data?.shipments)

      return result.data.shipments
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return [shipments, getAllShipments] as const
}

export function useGetShipmentsOfUPC() {
  const client = useApolloClient()
  const [shipments, setShipments] = useState(new Array<Shipment>())

  const getShipmentsOfUPC = async (UPC: string) => {
    try {
      const result = await client.query({
        query: GET_SHIPMENTS_OF_UPC,
        variables: { UPC },
        fetchPolicy: 'network-only'
      })
      setShipments(result?.data?.shipmentsOfUPC)

      return result.data.shipmentsOfUPC
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return [shipments, getShipmentsOfUPC] as const
}
