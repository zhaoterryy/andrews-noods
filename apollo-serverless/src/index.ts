import { ApolloServer, gql, UserInputError } from 'apollo-server-lambda'
import { getShipments, getShipmentsOfUPC, getShipment, createShipment, setHasShipped, deleteShipment, getDecayingShipments } from './dynamo-resolvers.js'
import { readFileSync } from 'fs'
import { GraphQLScalarType } from 'graphql'

const file = readFileSync('./schema.graphql', 'utf8')
const typeDefs = gql(file)

const hasNotShippedScalar = new GraphQLScalarType({
  name: 'HasNotShipped',
  description: 'Boolean flag for shipment',
  serialize: value => value === 'true',
  parseValue(value) {
    if (typeof value === 'boolean') {
      return value
    }
    
    throw new UserInputError(`[parseValue]: Expected a boolean value, got ${typeof value}`)
  },
  parseLiteral(ast) {
    if (ast.kind === 'BooleanValue') {
      return ast.value
    }

    throw new UserInputError(`[parseLiteral]: Expected a boolean value, got ${ast.kind}`)
  }
})

const resolvers = {
  HasNotShipped: hasNotShippedScalar,
  Query: {
    shipments: () => getShipments(),
    shipmentsOfUPC: (_parent, { UPC }) => getShipmentsOfUPC(UPC),
    shipment: (_parent, { shipmentId }) => getShipment(shipmentId),
    decayingShipments: (_parent, { UPC }) => getDecayingShipments(UPC)
  },
  Mutation: {
    createShipment: (_parent, { UPC, quantity, specialOrder }) => createShipment(UPC, quantity, specialOrder),
    setHasShipped: (_parent, { shipmentId, hasShipped }) => setHasShipped(shipmentId, hasShipped),
    deleteShipment: (_parent, { shipmentId }) => deleteShipment(shipmentId)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

export const graphqlHandler = server.createHandler()
