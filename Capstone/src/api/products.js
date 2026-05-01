import axios from 'axios'

// Open Food Facts API - Free, no API key required
const BASE_URL = 'https://world.openfoodfacts.org'

// Map categories to Open Food Facts categories
const CATEGORY_MAP = {
  'Fruits & Vegetables': 'produce',
  'Dairy & Eggs': 'dairy',
  'Snacks': 'snack',
  'Beverages': 'beverage',
  'Grains & Pulses': 'pasta-rice-cereals',
  'Meat & Poultry': 'meat',
}

// Fetch products from Open Food Facts
export const fetchProducts = async (category = '', page = 1, pageSize = 20) => {
  try {
    let searchTerm = category ? CATEGORY_MAP[category] || category : 'food'
    
    const response = await axios.get(`${BASE_URL}/cgi/search.pl`, {
      params: {
        search_terms: searchTerm,
        search_simple: 1,
        action: 'process',
        json: 1,
        page,
        page_size: pageSize,
        fields: 'code,product_name,brands,categories,image_url,nutrition_grades,quantity',
      },
      timeout: 10000,
    })

    if (response.data.products) {
      return response.data.products
        .filter(p => p.product_name && p.image_url)
        .map(transformProduct)
    }
    return []
  } catch (error) {
    console.error('Error fetching products:', error)
    return getFallbackProducts()
  }
}

// Search products by name
export const searchProductsAPI = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/cgi/search.pl`, {
      params: {
        search_terms: query,
        search_simple: 1,
        action: 'process',
        json: 1,
        page,
        page_size: 20,
        fields: 'code,product_name,brands,categories,image_url,nutrition_grades,quantity',
      },
      timeout: 10000,
    })

    if (response.data.products) {
      return response.data.products
        .filter(p => p.product_name)
        .map(transformProduct)
    }
    return []
  } catch (error) {
    console.error('Error searching products:', error)
    return getFallbackProducts().filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }
}

// Transform Open Food Facts product to our format
const transformProduct = (product) => {
  const basePrice = Math.random() * 10 + 2
  const stores = ['Walmart', 'Target', 'Kroger', 'Whole Foods', 'Costco', 'Aldi']
  const prices = stores.map(store => ({
    store,
    price: Number((basePrice * (0.8 + Math.random() * 0.4)).toFixed(2)),
    url: `#${product.code}`,
  }))

  let category = 'Other'
  const categories = product.categories || ''
  if (categories.toLowerCase().includes('dairy') || categories.toLowerCase().includes('milk') || categories.toLowerCase().includes('cheese')) {
    category = 'Dairy & Eggs'
  } else if (categories.toLowerCase().includes('fruit') || categories.toLowerCase().includes('vegetable') || categories.toLowerCase().includes('produce')) {
    category = 'Fruits & Vegetables'
  } else if (categories.toLowerCase().includes('snack') || categories.toLowerCase().includes('chip') || categories.toLowerCase().includes('cookie')) {
    category = 'Snacks'
  } else if (categories.toLowerCase().includes('beverage') || categories.toLowerCase().includes('drink') || categories.toLowerCase().includes('juice')) {
    category = 'Beverages'
  } else if (categories.toLowerCase().includes('pasta') || categories.toLowerCase().includes('rice') || categories.toLowerCase().includes('cereal') || categories.toLowerCase().includes('grain')) {
    category = 'Grains & Pulses'
  } else if (categories.toLowerCase().includes('meat') || categories.toLowerCase().includes('poultry') || categories.toLowerCase().includes('chicken')) {
    category = 'Meat & Poultry'
  }

  return {
    id: product.code || Math.random().toString(36).substr(2, 9),
    name: product.product_name || 'Unknown Product',
    category,
    image: product.image_url || 'https://via.placeholder.com/200',
    prices,
    unit: product.quantity || '1 unit',
    description: `${product.brands || 'Various brands'} - ${product.quantity || ''}`.trim(),
    nutritionGrade: product.nutrition_grades?.toUpperCase() || 'N/A',
    lastUpdated: new Date().toISOString().split('T')[0],
  }
}

// Get product by barcode
export const getProductByBarcode = async (barcode) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v0/product/${barcode}.json`, {
      timeout: 10000,
    })

    if (response.data.status === 1 && response.data.product) {
      return transformProduct(response.data.product)
    }
    return null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Fallback products when API fails
export const getFallbackProducts = () => [
  {
    id: '1',
    name: 'Organic Bananas',
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
    prices: [
      { store: 'Walmart', price: 0.59, url: '#' },
      { store: 'Target', price: 0.69, url: '#' },
      { store: 'Kroger', price: 0.55, url: '#' },
      { store: 'Whole Foods', price: 0.79, url: '#' },
    ],
    unit: 'lb',
    description: 'Fresh organic bananas',
    lastUpdated: '2026-05-01',
  },
  {
    id: '2',
    name: 'Whole Milk',
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200',
    prices: [
      { store: 'Walmart', price: 3.48, url: '#' },
      { store: 'Target', price: 3.79, url: '#' },
      { store: 'Kroger', price: 3.29, url: '#' },
      { store: 'Costco', price: 4.99, url: '#' },
    ],
    unit: 'gallon',
    description: 'Farm fresh whole milk',
    lastUpdated: '2026-05-01',
  },
  {
    id: '3',
    name: 'Large Eggs',
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200',
    prices: [
      { store: 'Walmart', price: 3.98, url: '#' },
      { store: 'Target', price: 4.49, url: '#' },
      { store: 'Kroger', price: 3.79, url: '#' },
      { store: 'Aldi', price: 2.99, url: '#' },
    ],
    unit: 'dozen',
    description: 'Grade A large eggs',
    lastUpdated: '2026-05-01',
  },
  {
    id: '4',
    name: 'Sliced Bread',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
    prices: [
      { store: 'Walmart', price: 2.98, url: '#' },
      { store: 'Target', price: 3.49, url: '#' },
      { store: 'Kroger', price: 2.79, url: '#' },
      { store: 'Whole Foods', price: 4.99, url: '#' },
    ],
    unit: 'loaf',
    description: 'Whole wheat sliced bread',
    lastUpdated: '2026-05-01',
  },
  {
    id: '5',
    name: 'Chicken Breast',
    category: 'Meat & Poultry',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200',
    prices: [
      { store: 'Walmart', price: 4.99, url: '#' },
      { store: 'Target', price: 5.49, url: '#' },
      { store: 'Kroger', price: 4.79, url: '#' },
      { store: 'Costco', price: 3.99, url: '#' },
    ],
    unit: 'lb',
    description: 'Boneless skinless chicken breast',
    lastUpdated: '2026-05-01',
  },
  {
    id: '6',
    name: 'Orange Juice',
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200',
    prices: [
      { store: 'Walmart', price: 4.98, url: '#' },
      { store: 'Target', price: 5.49, url: '#' },
      { store: 'Kroger', price: 4.49, url: '#' },
      { store: 'Whole Foods', price: 6.99, url: '#' },
    ],
    unit: '64 oz',
    description: '100% pure orange juice',
    lastUpdated: '2026-05-01',
  },
  {
    id: '7',
    name: 'Baby Spinach',
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200',
    prices: [
      { store: 'Walmart', price: 3.98, url: '#' },
      { store: 'Target', price: 4.49, url: '#' },
      { store: 'Kroger', price: 3.79, url: '#' },
      { store: 'Whole Foods', price: 5.99, url: '#' },
    ],
    unit: '5 oz',
    description: 'Pre-washed baby spinach',
    lastUpdated: '2026-05-01',
  },
  {
    id: '8',
    name: 'Greek Yogurt',
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200',
    prices: [
      { store: 'Walmart', price: 5.48, url: '#' },
      { store: 'Target', price: 5.99, url: '#' },
      { store: 'Kroger', price: 4.99, url: '#' },
      { store: 'Aldi', price: 3.99, url: '#' },
    ],
    unit: '32 oz',
    description: 'Plain Greek yogurt',
    lastUpdated: '2026-05-01',
  },
  {
    id: '9',
    name: 'Avocados',
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200',
    prices: [
      { store: 'Walmart', price: 1.98, url: '#' },
      { store: 'Target', price: 2.49, url: '#' },
      { store: 'Kroger', price: 1.79, url: '#' },
      { store: 'Whole Foods', price: 2.99, url: '#' },
    ],
    unit: 'each',
    description: 'Ripe Hass avocados',
    lastUpdated: '2026-05-01',
  },
  {
    id: '10',
    name: 'Pasta Sauce',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200',
    prices: [
      { store: 'Walmart', price: 2.98, url: '#' },
      { store: 'Target', price: 3.49, url: '#' },
      { store: 'Kroger', price: 2.49, url: '#' },
      { store: 'Aldi', price: 1.99, url: '#' },
    ],
    unit: '24 oz',
    description: 'Classic marinara pasta sauce',
    lastUpdated: '2026-05-01',
  },
  {
    id: '11',
    name: 'Cheddar Cheese',
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=200',
    prices: [
      { store: 'Walmart', price: 4.98, url: '#' },
      { store: 'Target', price: 5.49, url: '#' },
      { store: 'Kroger', price: 4.49, url: '#' },
      { store: 'Costco', price: 5.99, url: '#' },
    ],
    unit: '8 oz',
    description: 'Sharp cheddar cheese',
    lastUpdated: '2026-05-01',
  },
  {
    id: '12',
    name: 'Ground Coffee',
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200',
    prices: [
      { store: 'Walmart', price: 9.98, url: '#' },
      { store: 'Target', price: 11.49, url: '#' },
      { store: 'Kroger', price: 8.99, url: '#' },
      { store: 'Whole Foods', price: 12.99, url: '#' },
    ],
    unit: '12 oz',
    description: 'Medium roast ground coffee',
    lastUpdated: '2026-05-01',
  },
  {
    id: '13',
    name: 'Salmon Fillet',
    category: 'Meat & Poultry',
    image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=200',
    prices: [
      { store: 'Walmart', price: 12.99, url: '#' },
      { store: 'Target', price: 14.49, url: '#' },
      { store: 'Kroger', price: 11.99, url: '#' },
      { store: 'Whole Foods', price: 15.99, url: '#' },
    ],
    unit: 'lb',
    description: 'Atlantic salmon fillet',
    lastUpdated: '2026-05-01',
  },
  {
    id: '14',
    name: 'Potato Chips',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200',
    prices: [
      { store: 'Walmart', price: 3.98, url: '#' },
      { store: 'Target', price: 4.49, url: '#' },
      { store: 'Kroger', price: 3.49, url: '#' },
      { store: 'Aldi', price: 2.49, url: '#' },
    ],
    unit: '10 oz',
    description: 'Classic salted potato chips',
    lastUpdated: '2026-05-01',
  },
  {
    id: '15',
    name: 'Bottled Water',
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200',
    prices: [
      { store: 'Walmart', price: 4.98, url: '#' },
      { store: 'Target', price: 5.49, url: '#' },
      { store: 'Kroger', price: 4.49, url: '#' },
      { store: 'Costco', price: 3.99, url: '#' },
    ],
    unit: '24 pack',
    description: 'Purified bottled water',
    lastUpdated: '2026-05-01',
  },
  {
    id: '16',
    name: 'Rice',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200',
    prices: [
      { store: 'Walmart', price: 5.98, url: '#' },
      { store: 'Target', price: 6.49, url: '#' },
      { store: 'Kroger', price: 5.49, url: '#' },
      { store: 'Aldi', price: 4.49, url: '#' },
    ],
    unit: '10 lb',
    description: 'Long grain white rice',
    lastUpdated: '2026-05-01',
  },
  {
    id: '17',
    name: 'Strawberries',
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200',
    prices: [
      { store: 'Walmart', price: 4.98, url: '#' },
      { store: 'Target', price: 5.99, url: '#' },
      { store: 'Kroger', price: 4.49, url: '#' },
      { store: 'Whole Foods', price: 6.99, url: '#' },
    ],
    unit: '16 oz',
    description: 'Fresh organic strawberries',
    lastUpdated: '2026-05-01',
  },
  {
    id: '18',
    name: 'Peanut Butter',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1600189025748-51660d65a5d1?w=200',
    prices: [
      { store: 'Walmart', price: 3.48, url: '#' },
      { store: 'Target', price: 3.99, url: '#' },
      { store: 'Kroger', price: 3.29, url: '#' },
      { store: 'Aldi', price: 2.49, url: '#' },
    ],
    unit: '16 oz',
    description: 'Creamy peanut butter',
    lastUpdated: '2026-05-01',
  },
  {
    id: '19',
    name: 'Olive Oil',
    category: 'Grains & Pulses',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200',
    prices: [
      { store: 'Walmart', price: 9.98, url: '#' },
      { store: 'Target', price: 11.99, url: '#' },
      { store: 'Kroger', price: 8.99, url: '#' },
      { store: 'Whole Foods', price: 12.99, url: '#' },
    ],
    unit: '17 oz',
    description: 'Extra virgin olive oil',
    lastUpdated: '2026-05-01',
  },
  {
    id: '20',
    name: 'Cereal',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=200',
    prices: [
      { store: 'Walmart', price: 4.48, url: '#' },
      { store: 'Target', price: 5.49, url: '#' },
      { store: 'Kroger', price: 3.99, url: '#' },
      { store: 'Aldi', price: 2.99, url: '#' },
    ],
    unit: '18 oz',
    description: 'Whole grain cereal',
    lastUpdated: '2026-05-01',
  },
]

// Export mockProducts for backward compatibility
export const mockProducts = getFallbackProducts()

// Get all unique categories
export const getCategories = () => [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Snacks',
  'Beverages',
  'Grains & Pulses',
  'Meat & Poultry',
]

// Get product by ID
export const getProductById = (id) => mockProducts.find(p => p.id === id)

// Search products by name (local fallback)
export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase()
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  )
}

// Filter products by category
export const getProductsByCategory = (category) => {
  if (!category) return mockProducts
  return mockProducts.filter(p => p.category === category)
}

// Get price history (mock data for charts)
export const getPriceHistory = (productId) => {
  const product = getProductById(productId)
  if (!product) return []
  
  const history = []
  const basePrices = product.prices.map(p => p.price)
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    
    history.push({
      month: date.toLocaleString('default', { month: 'short' }),
      prices: basePrices.map(price => {
        const variation = (Math.random() - 0.5) * 0.2 * price
        return Number((price + variation).toFixed(2))
      }),
    })
  }
  
  return history
}

// Get all stores
export const getStores = () => ['Walmart', 'Target', 'Kroger', 'Whole Foods', 'Costco', 'Aldi']