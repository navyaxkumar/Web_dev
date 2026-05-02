import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchProducts, searchProductsAPI, getCategories, getFallbackProducts } from '../api/products'
import { saveItem } from '../store/productSlice'
import './SearchPage.css'

function SearchPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const savedItems = useSelector(state => state.products.savedItems)

  const [searchQuery, setSearchQuery] = useState('')
const [products, setProducts] = useState([])
const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
const [sortBy, setSortBy] = useState('relevance')
const [loading, setLoading] = useState(true)
const debounceTimer = useRef(null)

  const categories = getCategories()

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchProducts(selectedCategory, 1, 20)
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts(getFallbackProducts())
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategory])

  const handleSearch = async (e) => {
  e.preventDefault()
  if (!searchQuery.trim()) return

  setLoading(true)
  try {
    const results = await searchProductsAPI(searchQuery, 1)
    setProducts(results)
  } catch (error) {
    console.error('Search error:', error)
    const fallback = getFallbackProducts().filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setProducts(fallback)
  } finally {
    setLoading(false)
  }
}

const handleSearchInputChange = (e) => {
  const value = e.target.value
  setSearchQuery(value)

  if (debounceTimer.current) clearTimeout(debounceTimer.current)

  debounceTimer.current = setTimeout(async () => {
    if (!value.trim()) return
    setLoading(true)
    try {
      const results = await searchProductsAPI(value, 1)
      setProducts(results)
    } catch (error) {
      const fallback = getFallbackProducts().filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      )
      setProducts(fallback)
    } finally {
      setLoading(false)
    }
  }, 500)
}

  const getLowestPrice = useCallback((product) => {
  const allPrices = product.prices.map(storeItem => storeItem.price)
  return Math.min(...allPrices)
}, [])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setSearchQuery('')
    setSearchParams(category ? { category } : {})
  }

  const handleSaveItem = (product, e) => {
    e.stopPropagation()
    const isSaved = savedItems.some(item => item.id === product.id)

    if (isSaved) {
      toast.error('Item already saved')
      return
    }

    dispatch(saveItem(product))
    toast.success('Item saved')
  }

  const sortedProducts = useMemo(() => {
  const copiedProducts = [...products]

  copiedProducts.sort((a, b) => {
    const firstPrice = getLowestPrice(a)
    const secondPrice = getLowestPrice(b)

    if (sortBy === 'price-low') return firstPrice - secondPrice
    if (sortBy === 'price-high') return secondPrice - firstPrice
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return copiedProducts
}, [products, sortBy, getLowestPrice])

  return (
    <div className="search-page">
      <section className="search-header">
        <h1>Search Products</h1>
        <p className="search-subtitle">Find the best prices across multiple stores.</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
  type="text"
  placeholder="Search for milk, bread, apples..."
  value={searchQuery}
  onChange={handleSearchInputChange}
  className="search-input"
/>
          <button type="submit" className="search-btn">Search</button>
        </form>
      </section>

      <section className="filters-section">
        <div className="filter-group">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </section>

      <div className="category-tags">
        <button
          className={`category-tag ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-tag ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="results-info">
        <span className="results-count">Found {sortedProducts.length} products</span>
        {loading && <span className="loading-indicator">Loading...</span>}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map(product => {
            const lowestPrice = getLowestPrice(product)
            const isSaved = savedItems.some(item => item.id === product.id)

            return (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image' }}
                  />
                  <button
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    onClick={(e) => handleSaveItem(product, e)}
                    title={isSaved ? 'Already saved' : 'Save item'}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  {product.nutritionGrade && product.nutritionGrade !== 'N/A' && (
                    <span className="nutrition-badge" title="Nutrition Grade">
                      {product.nutritionGrade}
                    </span>
                  )}
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-unit">{product.unit}</p>
                  <div className="product-price">
                    <span className="price-label">From</span>
                    <span className="price-value">${lowestPrice.toFixed(2)}</span>
                  </div>
                  <div className="store-count">{product.prices.length} stores compared</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {sortedProducts.length === 0 && !loading && (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try a different search term or browse categories above.</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
