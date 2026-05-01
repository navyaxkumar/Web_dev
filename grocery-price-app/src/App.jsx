import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import SearchPage from './pages/SearchPage'
import ProductDetail from './pages/ProductDetail'
import SavedItems from './pages/SavedItems'
import Trends from './pages/Trends'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/saved" element={<SavedItems />} />
            <Route path="/trends" element={<Trends />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App