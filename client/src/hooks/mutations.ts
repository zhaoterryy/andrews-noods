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

  return { deleteShipment, setHasShipped }
}
