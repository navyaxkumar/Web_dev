import { useState } from 'react'
import { mockProducts, getCategories, getPriceHistory } from '../api/products'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import './Trends.css'

const green = '#2f7d46'
const blue = '#2f6f9f'
const orange = '#d97b38'
const rose = '#b85c6b'
const olive = '#7d8741'
const brown = '#8a6548'
const gridColor = '#e2e8df'
const axisColor = '#65706a'

function getStoreColor(storeName) {
  if (storeName === 'Walmart') return green
  if (storeName === 'Target') return blue
  if (storeName === 'Kroger') return orange
  if (storeName === 'Whole Foods') return rose
  if (storeName === 'Costco') return olive
  if (storeName === 'Aldi') return brown
  return green
}

function getCategoryColor(index) {
  if (index === 0) return green
  if (index === 1) return blue
  if (index === 2) return orange
  if (index === 3) return rose
  if (index === 4) return olive
  return brown
}

function Trends() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const categories = ['All', ...getCategories()]
  
  const filteredProducts = selectedCategory === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory)
  
  const topCheapest = [...filteredProducts]
    .sort((a, b) => {
      const aLow = Math.min(...a.prices.map(p => p.price))
      const bLow = Math.min(...b.prices.map(p => p.price))
      return aLow - bLow
    })
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      price: Math.min(...p.prices.map(price => price.price))
    }))
  
  const categoryDistribution = categories.slice(1).map((cat, index) => ({
    name: cat,
    value: mockProducts.filter(p => p.category === cat).length,
    color: getCategoryColor(index),
  }))
  
  const storeComparison = mockProducts.slice(0, 10).map(p => {
    const prices = p.prices
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      Walmart: prices.find(x => x.store === 'Walmart')?.price || 0,
      Target: prices.find(x => x.store === 'Target')?.price || 0,
      Kroger: prices.find(x => x.store === 'Kroger')?.price || 0,
    }
  })
  
  const storeAverages = ['Walmart', 'Target', 'Kroger', 'Whole Foods', 'Costco', 'Aldi'].map(store => {
    let total = 0
    let count = 0
    mockProducts.forEach(p => {
      const price = p.prices.find(x => x.store === store)
      if (price) {
        total += price.price
        count++
      }
    })
    return {
      store,
      average: count > 0 ? (total / count).toFixed(2) : 0
    }
  }).filter(s => s.average > 0)
  
  const handleProductSelect = (productId) => {
    const product = mockProducts.find(p => p.id === productId)
    setSelectedProduct(product)
  }
  
  const priceHistoryData = selectedProduct ? getPriceHistory(selectedProduct.id) : []
  
  const chartData = priceHistoryData.map((item) => {
    const dataPoint = { month: item.month }

    if (selectedProduct) {
      selectedProduct.prices.forEach((price, i) => {
        dataPoint[price.store] = item.prices[i]
      })
    }

    return dataPoint
  })
  
  return (
    <div className="trends-page">
      <h1>Price Trends & Analytics</h1>
      <div className="trend-toolbar">
        <label>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setSelectedProduct(null)
          }}
          className="product-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div className="trends-grid">
        <div className="trend-card">
          <h2>Top 5 Cheapest Products</h2>
          <ResponsiveContainer width="100%" height={300}>
        <BarChart
    data={topCheapest}
    layout="vertical"
    margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

    <XAxis type="number" stroke={axisColor} />
    <YAxis dataKey="name" type="category" stroke={axisColor} width={80} />

    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Price']} />

    <Bar
      dataKey="price"
      fill={green}
      radius={[0, 4, 4, 0]}
      isAnimationActive={false}
    />
  </BarChart>
</ResponsiveContainer>
        </div>
        
        <div className="trend-card">
          <h2>Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={categoryDistribution}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={100}
      paddingAngle={2}
      dataKey="value"
      label={({ name, value }) => `${name}: ${value}`}
      isAnimationActive={false}  
    >
      {categoryDistribution.map(entry => (
        <Cell key={entry.name} fill={entry.color} />
      ))}
    </Pie>

    <Tooltip />
  </PieChart>
</ResponsiveContainer>
        </div>
        
        <div className="trend-card">
          <h2>Average Prices by Store</h2>
          <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={storeAverages}
    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

    <XAxis
      dataKey="store"
      stroke={axisColor}
      angle={-45}
      textAnchor="end"
      interval={0}
    />

    <YAxis stroke={axisColor} />

    <Tooltip formatter={(value) => [`$${value}`, 'Average Price']} />

    <Bar
      dataKey="average"
      fill={blue}
      radius={[4, 4, 0, 0]}
      isAnimationActive={false} 
    />
  </BarChart>
</ResponsiveContainer>
        </div>
        
        <div className="trend-card wide">
          <h2>Store Price Comparison (Sample Products)</h2>
          <ResponsiveContainer width="100%" height={300}>
  <LineChart
    data={storeComparison}
    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

    <XAxis dataKey="name" stroke={axisColor} />
    <YAxis stroke={axisColor} />

    <Tooltip />
    <Legend />

    <Line
      type="monotone"
      dataKey="Walmart"
      stroke={getStoreColor('Walmart')}
      strokeWidth={2}
      dot={false}
      isAnimationActive={false}
    />

    <Line
      type="monotone"
      dataKey="Target"
      stroke={getStoreColor('Target')}
      strokeWidth={2}
      dot={false}
      isAnimationActive={false}
    />

    <Line
      type="monotone"
      dataKey="Kroger"
      stroke={getStoreColor('Kroger')}
      strokeWidth={2}
      dot={false}
      isAnimationActive={false}
    />

  </LineChart>
</ResponsiveContainer>
        </div>
        
        <div className="trend-card wide">
          <h2>Product Price History</h2>
          <div className="product-selector">
            <label>Select a product:</label>
            <select 
              value={selectedProduct?.id || ''} 
              onChange={(e) => handleProductSelect(e.target.value)}
              className="product-select"
            >
              <option value="">-- Select a product --</option>
              {filteredProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          {selectedProduct && (
            <div className="price-history-chart">
              <h3>{selectedProduct.name} - 6 Month Price Trend</h3>
              <ResponsiveContainer width="100%" height={350}>
  <LineChart
    data={chartData}
    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

    <XAxis dataKey="month" stroke={axisColor} />
    <YAxis stroke={axisColor} domain={['auto', 'auto']} />

    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Price']} />
    <Legend />

    {selectedProduct.prices.map((price) => (
      <Line
        key={price.store}
        type="monotone"
        dataKey={price.store}
        stroke={getStoreColor(price.store)}
        strokeWidth={2}
        dot={false}           
        isAnimationActive={false} 
      />
    ))}

  </LineChart>
</ResponsiveContainer>
            </div>
          )}
          
          {!selectedProduct && (
            <div className="no-selection">
              <p>Select a product above to view its price history over time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Trends
