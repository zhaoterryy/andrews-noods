import { createContext, useContext, useState } from 'react'
import '../utils/polyfills'
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js'

type AuthenticateParams = {
  Username: string
  Password: string
}

type IAuthContext = {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  token: string
  setToken: (value: string) => void
}

const AuthContext = createContext<IAuthContext | null>(null)
export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState('')

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      token,
      setToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (import.meta.env.DEV) {
    if (ctx === null) throw new Error('useAuth must be used within a AuthProvider')
  }

  const { isAuthenticated, token, setIsAuthenticated, setToken } = ctx!
  const authenticate = async (user: AuthenticateParams) => {
    return new Promise((resolve, reject) => {
      const authDetails = new AuthenticationDetails(user)
      const poolData = {
        ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      }
      const userPool = new CognitoUserPool(poolData)
      const userData = {
        Username: user.Username,
        Pool: userPool
      }

      const cognitoUser = new CognitoUser(userData)
      cognitoUser.authenticateUser(authDetails, {
        onSuccess(session: CognitoUserSession, userConfirmationNecessary?: boolean) {
          const token = session.getIdToken().getJwtToken()
          setIsAuthenticated(true)
          setToken(token)

          resolve(token)
        },
        onFailure(err) {
          reject(err)
        }
      })
    })
  }

  return { isAuthenticated, token, authenticate }
}
