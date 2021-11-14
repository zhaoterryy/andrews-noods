/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URI: string
  readonly VITE_COGNITO_CLIENT_ID: string
  readonly VITE_COGNITO_USER_POOL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
