"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface SearchFilterProps {
  searchTerm: string
  selectedCategory: string
  selectedType: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onTypeChange: (value: string) => void
  totalItems: number
  filteredItems: number
}

const categories = ["ID Cards", "Electronics", "Stationary", "Clothing", "Other"]

export function SearchFilter({
  searchTerm,
  selectedCategory,
  selectedType,
  onSearchChange,
  onCategoryChange,
  onTypeChange,
  totalItems,
  filteredItems,
}: SearchFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Search className="h-5 w-5" />
            <span>Search &amp; Filter Items</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {filteredItems} of {totalItems} items
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by description, location, or category..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lost">Lost Items</SelectItem>
              <SelectItem value="found">Found Items</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
