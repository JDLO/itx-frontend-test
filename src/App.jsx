import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ProductDetailsPage from './views/ProudctDetailsPage'
import ProductListPage from './views/ProductListPage'
import { CartProvider } from './context/CartContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './componets/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
