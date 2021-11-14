import { ApolloClient, ApolloProvider, gql, InMemoryCache } from '@apollo/client'
import { useRef } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import schema from '../../apollo-serverless/schema.graphql?raw'
import './App.css'
import { ShipmentCatalog } from './components/ShipmentCatalog'
import { AuthProvider, useAuth } from './hooks/auth'

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

    await authenticate({ Username, Password })
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
