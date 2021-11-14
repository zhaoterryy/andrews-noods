import { ApolloClient, ApolloProvider, createHttpLink, gql, InMemoryCache, useApolloClient } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import schema from '../../apollo-serverless/schema.graphql?raw'
import './App.css'
import { CreateShipmentCard } from './components/CreateShipmentCard'
import { ShipmentCard } from './components/ShipmentCard'
import { AuthProvider, useAuth } from './hooks/auth'
import { useGetShipments } from './hooks/queries'
import type { Shipment } from './utils/schema-types'
import { setContext } from '@apollo/client/link/context'

export function App() {
  const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URI,
    cache: new InMemoryCache(),
    typeDefs: gql(schema)
  })

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ShipmentCatalog />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </AuthProvider>
  )
}

function ShipmentCatalog() {
  const { isAuthenticated, token } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI
  })

  const client = useApolloClient()
  client.setLink(authLink.concat(httpLink))

  const { shipments } = useGetShipments()
  const [shipmentsToShow, setShipmentsToShow] = useState(new Array<Shipment>())

  useEffect(() => {
    setShipmentsToShow(shipments)
  }, [shipments])

  const onShipmentDeleted = (shipmentId: string) => {
    setShipmentsToShow(shipmentsToShow.filter(s => s.shipmentId !== shipmentId))
  }

  const onShipmentCreated = (shipment: Shipment) => {
    setShipmentsToShow([...shipmentsToShow, shipment])
  }

  return (
    <div className="shipment-catalog">
      <div className="shipment-card-container">
        {shipmentsToShow.map(s => (
          <ShipmentCard
            key={s.shipmentId}
            shipment={s}
            onShipmentDeleted={onShipmentDeleted} />
        ))}
        <CreateShipmentCard onShipmentCreated={onShipmentCreated} />
      </div>
    </div>
  )
}

function Login() {
  const { isAuthenticated, authenticate } = useAuth()
  const usernameField = useRef<HTMLInputElement>(null)
  const passwordField = useRef<HTMLInputElement>(null)
  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  const onSubmit = async () => {
    if (!usernameField.current || !passwordField.current) return
    const Username = usernameField.current.value
    const Password = passwordField.current.value

    const token = await authenticate({ Username, Password })
  }

  return (
    <div className="login">
      <div className="title-wrapper">
        <h1>Instant Noodle Shipments</h1>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" ref={usernameField} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" ref={passwordField} />
        <div className="submit-btn-wrapper">
          <button type="submit" onClick={onSubmit}>Login</button>
        </div>
      </form>
    </div>
  )
}

export default App
