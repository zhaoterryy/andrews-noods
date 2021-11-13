import { ApolloServer, gql } from 'apollo-server'
import { getShipments, getShipmentsOfUPC, getShipment, createShipment, setHasShipped, deleteShipment } from './dynamo-resolvers.js'

const typeDefs = gql`
  scalar Date

  type Shipment {
    shipmentId: ID!
    UPC: String!
    orderTime: Date!
    numOrdered: Int!
    isSpecialOrder: Boolean
    hasShipped: Boolean
  }

  type Query {
    shipments: [Shipment!]
    shipmentsOfUPC(UPC: String!): [Shipment!]
    shipment(shipmentId: ID!): Shipment
  }

  type Mutation {
    createShipment(UPC: String!, quantity: Int!, specialOrder: Boolean): CreateShipmentResponse!
    setHasShipped(shipmentId: ID!, hasShipped: Boolean!): Shipment!
    deleteShipment(shipmentId: ID!): Shipment!
  }

  type CreateShipmentResponse {
    shipmentId: ID!
    orderTime: Date!
  }
`

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

await server.listen()
console.log('http://localhost:4000/')
