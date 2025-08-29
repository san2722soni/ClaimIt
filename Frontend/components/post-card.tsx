"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Mail, Camera, MessageCircle, Phone } from "lucide-react"
import type { Post } from "@/components/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const handleWhatsAppContact = () => {
    const phoneRaw = post.owner.phone || "1234567890"
    const phone = phoneRaw.replace(/[^\d]/g, "") || "1234567890"
    const message = encodeURIComponent(
      `Hi! I saw your ${post.type} item post: "${post.content.slice(0, 50)}...". I'd like to get in touch.`,
    )
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
  }

  const isLostItem = post.type === "lost"
  const statusColor = isLostItem 
    ? "bg-red-50 text-red-700 border-red-200" 
    : "bg-green-50 text-green-700 border-green-200"

  return (
    <Card className="group border border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 max-w-4xl mx-auto overflow-hidden">
      {/* Header with User Info and Status */}
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">
                {post.owner.username.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isLostItem ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold text-foreground truncate">
                {post.owner.username}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {new Date(post.createdAt).toLocaleDateString()} • {post.category}
              </CardDescription>
            </div>
          </div>
          
          <Badge 
            className={`${statusColor} font-medium px-2 py-0.5 text-xs border`}
          >
            {isLostItem ? "Lost" : "Found"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Image Section */}
        {post.descriptionImage && (
          <div className="relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden border border-border/30">
            <img
              src={post.descriptionImage || "/placeholder.svg"}
              alt="Item description"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                target.nextElementSibling?.classList.remove("hidden")
              }}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Image attached</span>
              </div>
            </div>
            
            {/* Category badge overlay */}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs">
                {post.category}
              </Badge>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-border/30">
            <h3 className="font-semibold text-sm text-gray-600 mb-2">Description</h3>
            <p className="text-sm leading-relaxed text-gray-800">{post.content}</p>
          </div>

          {/* Location and Date Info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 rounded-md p-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Location:</span>
              <span className="truncate">{post.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 rounded-md p-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">Date:</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        {/* Compact Contact Section - Single Row */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between gap-3">
            {/* Contact Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Contact Owner</h4>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{post.owner.email}</span>
                </div>
                {post.owner.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{post.owner.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Button */}
            <Button
              onClick={handleWhatsAppContact}
              className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 shrink-0"
              size="sm"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}