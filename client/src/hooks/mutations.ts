import { FetchResult, gql, useApolloClient } from '@apollo/client'

type DeleteShipmentResponse = {
  deleteShipment: {
    shipmentId: string
  }
}

const DELETE_SHIPMENT = gql`
  mutation Mutation($shipmentId: ID!) {
    deleteShipment(shipmentId: $shipmentId) {
      shipmentId
    }
  }
`

type SetHasShippedResponse = {
  setHasShipped: {
    shipmentId: string
    hasShipped: boolean
  }
}

const SET_HAS_SHIPPED = gql`
  mutation Mutation($shipmentId: ID!, $hasShipped: Boolean!) {
    setHasShipped(shipmentId: $shipmentId, hasShipped: $hasShipped) {
      shipmentId
      hasShipped
    }
  }
`

type CreateShipmentResponse = {
  createShipment: {
    shipmentId: string
    orderTime: Date
  }
}

const CREATE_SHIPMENT = gql`
  mutation Mutation($upc: String!, $quantity: Int!, $specialOrder: Boolean) {
    createShipment(UPC: $upc, quantity: $quantity, specialOrder: $specialOrder) {
      shipmentId
      orderTime
    }
  }
`

export function useMutations() {
  const client = useApolloClient()

  const deleteShipment = async (shipmentId: string) => {
    try {
      const result: FetchResult<DeleteShipmentResponse> = await client.mutate({
        mutation: DELETE_SHIPMENT,
        variables: { shipmentId }
      })

      if (result.data == null) {
        return Promise.reject(new Error('No data returned - double check shipmentId'))
      }

      return result.data.deleteShipment.shipmentId
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const setHasShipped = async (shipmentId: string, hasShipped: boolean) => {
    try {
      const result: FetchResult<SetHasShippedResponse> = await client.mutate({
        mutation: SET_HAS_SHIPPED,
        variables: { shipmentId, hasShipped }
      })

      if (result.data == null) {
        return Promise.reject(new Error('No data returned - double check shipmentId'))
      }

      return result.data.setHasShipped
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const createShipment = async (upc: string, quantity: number, specialOrder: boolean) => {
    try {
      const result: FetchResult<CreateShipmentResponse> = await client.mutate({
        mutation: CREATE_SHIPMENT,
        variables: { upc, quantity, specialOrder }
      })

      if (result.data == null) {
        return Promise.reject(new Error('Server internal error'))
      }

      return result.data.createShipment
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { deleteShipment, setHasShipped, createShipment }
}
