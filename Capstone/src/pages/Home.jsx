import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  const categoryList = [
    { label: 'Fruits & Vegetables', icon: 'Produce' },
    { label: 'Dairy & Eggs', icon: 'Dairy' },
    { label: 'Snacks', icon: 'Snacks' },
    { label: 'Beverages', icon: 'Drinks' },
    { label: 'Grains & Pulses', icon: 'Pantry' },
    { label: 'Meat & Poultry', icon: 'Protein' },
  ]

  const goToSearch = () => {
    navigate('/search')
  }

  const searchByCategory = (categoryName) => {
    navigate(`/search?category=${categoryName}`)
  }

  return (
    <div className="home">

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Smart grocery shopping</p>

          <h1>Compare grocery prices before you buy.</h1>

          <p>
            Search products, compare store prices, save regular items,
            and see simple price trends in one place.
          </p>

          <button className="hero-btn" onClick={goToSearch}>
            Start Comparing
          </button>
        </div>
      </section>


      <section className="categories-section">
        <h2>Browse by Category</h2>

        <div className="categories-grid">
          {categoryList.map((category) => {
            return (
              <button
                key={category.label}
                className="category-card"
                onClick={() => searchByCategory(category.label)}
              >
                <span className="category-emoji">
                  {category.icon}
                </span>

                <span className="category-label">
                  {category.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>


      <section className="features-section">

        <div className="feature">
          <h3>Price Trends</h3>
          <p>Track how prices change over time.</p>
        </div>

        <div className="feature">
          <h3>Save Items</h3>
          <p>Keep products you buy often in one list.</p>
        </div>

        <div className="feature">
          <h3>Quick Search</h3>
          <p>Find grocery products and compare stores quickly.</p>
        </div>

      </section>

    </div>
  )
}

export default Home