export interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: Rating
  }
  
export interface Rating {
    rate: number
    count: number
  }

export interface CartItem {
  productId: number
  title: string
  price: number
  image: string
  quantity: number
}

export interface Cart {
  id: number
  userId: number
  date: string
  products: CartProduct[]
}

export interface CartProduct {
  productId: number
  quantity: number
}