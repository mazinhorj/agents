import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app.tsx'

// O React 18 exige que o elemento raiz seja não nulo
// Isso é necessário para garantir que o React possa renderizar corretamente o aplicativo
// O uso de `!` é uma maneira de afirmar que o elemento não será nulo
// Isso é seguro aqui, pois o elemento com id 'root' deve existir no HTML
// Se o elemento não existir, o React lançará um erro
// Isso é uma prática comum ao usar React 18 para garantir que o ponto de montagem esteja presente
// e evitar erros de renderização no console
// biome-ignore lint/style/noNonNullAssertion: obrigatório no React 18
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
