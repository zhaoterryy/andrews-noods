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

export function useMutations() {
  const client = useApolloClient()

  const deleteShipment = async (shipmentId: string) => {
    try {
      const result: FetchResult<DeleteShipmentResponse> = await client.mutate({
        mutation: DELETE_SHIPMENT,
        variables: { shipmentId }
      })

      return result.data?.deleteShipment.shipmentId
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { deleteShipment }
}
