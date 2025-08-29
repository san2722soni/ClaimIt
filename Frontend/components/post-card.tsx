"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Mail, Camera, MessageCircle } from "lucide-react"
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

  return (
    <Card className="border border-border/70 hover:shadow-md transition-shadow max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
            {post.owner.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">{post.owner.username}</CardTitle>
              <Badge
                variant={post.type === "lost" ? "destructive" : "default"}
                className={post.type === "lost" ? "text-xs" : "text-xs bg-emerald-100 text-emerald-700"}
              >
                {post.type === "lost" ? "Lost" : "Found"}
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()} • {post.category}
            </CardDescription>
          </div>
          <button
            onClick={handleWhatsAppContact}
            aria-label="Contact on WhatsApp"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-colors"
            title="Contact on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {post.descriptionImage && (
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={post.descriptionImage || "/placeholder.svg"}
              alt="Item description"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                target.nextElementSibling?.classList.remove("hidden")
              }}
            />
            <div className="hidden flex items-center justify-center w-full h-full">
              <Camera className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Image attached</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">{post.content}</p>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button
            variant="default"
            size="sm"
            onClick={handleWhatsAppContact}
            className="w-full bg-accent hover:opacity-90 text-accent-foreground"
            aria-label="Contact on WhatsApp"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>
        </div>

        <div className="text-xs text-gray-500 pt-1">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span>{post.owner.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
