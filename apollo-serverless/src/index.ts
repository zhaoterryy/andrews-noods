import { ApolloServer, gql } from 'apollo-server-lambda'
import { getShipments, getShipmentsOfUPC, getShipment, createShipment, setHasShipped, deleteShipment } from './dynamo-resolvers.js'
import { readFileSync } from 'fs'

const file = readFileSync('./schema.graphql', 'utf8')
const typeDefs = gql(file)

const resolvers = {
  Query: {
    shipments: () => getShipments(),
    shipmentsOfUPC: (_parent, { UPC }) => getShipmentsOfUPC(UPC),
    shipment: (_parent, { shipmentId }) => getShipment(shipmentId)
  },
  Mutation: {
    createShipment: (_parent, { UPC, quantity, specialOrder }) => createShipment(UPC, quantity, specialOrder),
    setHasShipped: (_parent, { shipmentId, hasShipped }) => setHasShipped(shipmentId, hasShipped),
    deleteShipment: (_parent, { shipmentId }) => deleteShipment(shipmentId)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

export const graphqlHandler = server.createHandler()
