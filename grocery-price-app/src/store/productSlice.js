import { createSlice } from '@reduxjs/toolkit'

// Load saved items from localStorage
const loadSavedItems = () => {
  try {
    const saved = localStorage.getItem('savedItems')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Save items to localStorage
const saveSavedItems = (items) => {
  try {
    localStorage.setItem('savedItems', JSON.stringify(items))
  } catch {
    console.error('Failed to save to localStorage')
  }
}

const initialState = {
  products: [],
  searchResults: [],
  savedItems: loadSavedItems(),
  loading: false,
  error: null,
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 100,
    sortBy: 'relevance',
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    saveItem: (state, action) => {
      const product = action.payload
      const exists = state.savedItems.find(item => item.id === product.id)
      if (!exists) {
        state.savedItems.push(product)
        saveSavedItems(state.savedItems)
      }
    },
    removeItem: (state, action) => {
      state.savedItems = state.savedItems.filter(item => item.id !== action.payload)
      saveSavedItems(state.savedItems)
    },
    clearSearch: (state) => {
      state.searchResults = []
    },
  },
})

export const {
  setProducts,
  setSearchResults,
  setLoading,
  setError,
  setFilters,
  saveItem,
  removeItem,
  clearSearch,
} = productSlice.actions

export default productSlice.reducer