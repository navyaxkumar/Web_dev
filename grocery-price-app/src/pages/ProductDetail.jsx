import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getProductById, getPriceHistory } from '../api/products'
import { saveItem, removeItem } from '../store/productSlice'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './ProductDetail.css'


function getStoreColor(storeName) {
  if (storeName === 'Walmart') return '#2f7d46'
  if (storeName === 'Target') return '#2f6f9f'
  if (storeName === 'Kroger') return '#d97b38'
  if (storeName === 'Whole Foods') return '#b85c6b'
  if (storeName === 'Costco') return '#7d8741'
  if (storeName === 'Aldi') return '#8a6548'
  return '#2f7d46'
}


function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const savedItems = useSelector(state => state.products.savedItems)


  const product = getProductById(id)
  const priceHistory = getPriceHistory(id)


  if (!product) {
    return (
      <div className="product-detail">
        <div className="loading">Product not found.</div>
      </div>
    )
  }

  const isSaved = savedItems.some(item => item.id === product.id)


  const priceList = product.prices.map(item => item.price)

  const lowestPrice = Math.min(...priceList)
  const highestPrice = Math.max(...priceList)

  const totalPrice = priceList.reduce((sum, price) => sum + price, 0)
  const averagePrice = totalPrice / priceList.length


  const chartData = priceHistory.map((historyItem) => {
    const dataPoint = { month: historyItem.month }

    product.prices.forEach((store, index) => {
      dataPoint[store.store] = historyItem.prices[index]
    })

    return dataPoint
  })


  /* ===== SAVE / REMOVE ITEM ===== */
  const handleSaveToggle = () => {
    if (isSaved) {
      dispatch(removeItem(product.id))
      toast.success('Item removed from saved')
    } else {
      dispatch(saveItem(product))
      toast.success('Item saved')
    }
  }


  return (
    <div className="product-detail">

      <button className="back-btn" onClick={() => navigate(-1)}>
        Back to Search
      </button>

      <section className="product-header">

        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info-section">
          <span className="product-category">{product.category}</span>

          <h1>{product.name}</h1>

          <p className="product-description">
            {product.description}
          </p>

          <p className="product-unit">Unit: {product.unit}</p>
          <p className="last-updated">
            Last updated: {product.lastUpdated}
          </p>

          {/* SAVE BUTTON */}
          <button
            className={`save-toggle-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveToggle}
          >
            {isSaved ? 'Saved' : 'Save Item'}
          </button>
        </div>
      </section>


      <section className="price-summary">

        <div className="price-card lowest">
          <span className="price-label">Lowest Price</span>
          <span className="price-value">${lowestPrice.toFixed(2)}</span>
        </div>

        <div className="price-card average">
          <span className="price-label">Average Price</span>
          <span className="price-value">${averagePrice.toFixed(2)}</span>
        </div>

        <div className="price-card highest">
          <span className="price-label">Highest Price</span>
          <span className="price-value">${highestPrice.toFixed(2)}</span>
        </div>

        <div className="price-card savings">
          <span className="price-label">Potential Savings</span>
          <span className="price-value">
            ${(highestPrice - lowestPrice).toFixed(2)}
          </span>
        </div>

      </section>


      <section className="stores-comparison">
        <h2>Store Price Comparison</h2>

        <div className="stores-list">
          {[...product.prices]
            .sort((a, b) => a.price - b.price) 
            .map((storeItem, index) => {

              const isBestPrice = index === 0

              return (
                <div
                  key={storeItem.store}
                  className={`store-card ${isBestPrice ? 'best-price' : ''}`}
                >
                  <div className="store-rank">
                    {isBestPrice && (
                      <span className="best-badge">Best Price</span>
                    )}
                    {index + 1}
                  </div>

                  <div className="store-name">
                    {storeItem.store}
                  </div>

                  <div className="store-price">
                    ${storeItem.price.toFixed(2)}
                  </div>

                  <button className="visit-store-btn">
                    Visit Store
                  </button>
                </div>
              )
            })}
        </div>
      </section>


      <section className="price-trend-chart">
        <h2>Price Trend: Last 6 Months</h2>

       <ResponsiveContainer width="100%" height={360}>
         <LineChart data={chartData} margin={{ top: 20, right: 24, left: 10, bottom: 20 }}>

    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8df" />

    <XAxis dataKey="month" stroke="#65706a" />
    <YAxis stroke="#65706a" />

    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />

    <Legend />

    {product.prices.map((store) => (
      <Line
        key={store.store}
        type="monotone"
        dataKey={store.store}
        stroke={getStoreColor(store.store)}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    ))}

  </LineChart>
</ResponsiveContainer>
      </section>

    </div>
  )
}

export default ProductDetail