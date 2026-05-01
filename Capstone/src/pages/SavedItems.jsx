import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { removeItem } from '../store/productSlice'
import './SavedItems.css'

function SavedItems() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const savedItems = useSelector(state => state.products.savedItems)


  const getLowestPrice = (product) => {
    const priceList = product.prices.map(item => item.price)
    return Math.min(...priceList)
  }


  const handleRemoveItem = (productId) => {
    dispatch(removeItem(productId))
    toast.success('Item removed')
  }


  const calculateTotalSavings = () => {
    let totalSavings = 0

    savedItems.forEach((product) => {
      const priceList = product.prices.map(item => item.price)

      const lowest = Math.min(...priceList)
      const highest = Math.max(...priceList)

      totalSavings += (highest - lowest)
    })

    return totalSavings.toFixed(2)
  }


  return (
    <div className="saved-items-page">

      <h1>Saved Items</h1>


      {savedItems.length > 0 && (
        <section className="savings-summary">

          <div className="savings-card">
            <span className="savings-label">Total Items</span>
            <span className="savings-value">
              {savedItems.length}
            </span>
          </div>

          <div className="savings-card">
            <span className="savings-label">Potential Savings</span>
            <span className="savings-value">
              ${calculateTotalSavings()}
            </span>
          </div>

        </section>
      )}


      {savedItems.length === 0 ? (
        <section className="empty-state">

          <h2>No saved items yet</h2>

          <p>
            Start saving products to track their prices and compare across stores.
          </p>

          <button
            className="browse-btn"
            onClick={() => navigate('/search')}
          >
            Browse Products
          </button>

        </section>

      ) : (

        <div className="saved-items-grid">

          {savedItems.map((product) => {

            const lowestPrice = getLowestPrice(product)

            return (
              <div
                key={product.id}
                className="saved-item-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >

                <div className="saved-item-image">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="saved-item-info">

                  <h3>{product.name}</h3>

                  <p className="saved-item-category">
                    {product.category}
                  </p>

                  <p className="saved-item-unit">
                    {product.unit}
                  </p>

                  <div className="saved-item-price">
                    <span className="price-label">From</span>
                    <span className="price-value">
                      ${lowestPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="saved-item-stores">
                    {product.prices.length} stores compared
                  </div>
                </div>


                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation() 
                    handleRemoveItem(product.id)
                  }}
                  aria-label={`Remove ${product.name}`}
                >
                  x
                </button>

              </div>
            )
          })}

        </div>
      )}

    </div>
  )
}

export default SavedItems