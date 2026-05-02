import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const SavedItems = lazy(() => import('./pages/SavedItems'))
const Trends = lazy(() => import('./pages/Trends'))

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
              fontSize: '18px',
              color: '#6b7280'
            }}>
              Loading...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/saved" element={<SavedItems />} />
              <Route path="/trends" element={<Trends />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App