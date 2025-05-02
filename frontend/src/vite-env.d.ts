/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SPOONACULAR_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 