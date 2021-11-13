import { ApolloClient, ApolloProvider, gql, InMemoryCache } from '@apollo/client'
import React from 'react'
import ReactDOM from 'react-dom'
import schema from '../../apollo-serverless/schema.graphql?raw'
import App from './App'
import './index.css'

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URI,
  cache: new InMemoryCache(),
  typeDefs: gql(schema)
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
