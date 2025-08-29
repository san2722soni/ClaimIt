export type ItemCategory = "ID Cards" | "Electronics" | "Stationery" | "Clothing" | "Other"
export type ItemType = "Lost" | "Found"

export interface Post {
  id: string
  type: ItemType
  itemName: string
  description: string
  location: string
  dateISO: string
  category: ItemCategory
  imageUrl?: string
  contactName?: string
  contactPhone?: string // used for wa.me link
  // ownerId?: string  // for future Mongo integration
  // descriptionImage?: string // aligns with your schema naming if needed later
}

/** User shape used by UI components (aligns with future Mongo User ref) */
export interface User {
  _id: string
  username: string
  email: string
  avatar: string
  phone?: string
}

/** Post shape used by current UI (owner object + createdAt Date, etc.) */
export interface MongoStylePost {
  _id: string
  owner: User
  content: string
  descriptionImage?: string
  category: "ID Cards" | "Electronics" | "Stationary" | "Clothing" | "Other"
  location: string
  date: string
  type: "lost" | "found"
  createdAt: Date
}

/** Form payload for creating posts from the PostForm component */
export interface PostFormData {
  content: string
  descriptionImage: string
  category: "ID Cards" | "Electronics" | "Stationary" | "Clothing" | "Other"
  location: string
  date: string
  type: "lost" | "found"
  itemName?: string
  contactPhone?: string
}
