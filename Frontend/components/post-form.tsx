"use client"

import type React from "react"
import { useState } from "react"
import type { User, PostFormData } from "@/components/types"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Upload, X, Image as ImageIcon } from "lucide-react"

// Available item categories
const categories = ["ID Cards", "Electronics", "Stationary", "Clothing", "Other"] as const

// Zod validation schema for form data
const postFormSchema = z.object({
  itemName: z
    .string()
    .min(2, "Item name must be at least 2 characters")
    .max(100, "Item name must not exceed 100 characters"),
  
  content: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  
  category: z
    .enum(categories, {
      required_error: "Please select a category",
    }),
  
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters"),
  
  date: z
    .string()
    .min(1, "Date is required")
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      return selectedDate >= thirtyDaysAgo && selectedDate <= today
    }, "Date must be within the last 30 days"),
  
  descriptionImage: z
    .string()
    .optional()
    .or(z.literal("")),
  
  contactPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
})

type PostFormValues = z.infer<typeof postFormSchema>

interface PostFormProps {
  type: "lost" | "found"
  currentUser: User
  onSubmit: (postData: PostFormData) => void
}

export function PostForm({ type, currentUser, onSubmit }: PostFormProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      itemName: "",
      content: "",
      category: undefined,
      location: "",
      date: "",
      descriptionImage: "",
      contactPhone: "",
    },
  })

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      alert('Image must be smaller than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64 for preview
      const reader = new FileReader()
      reader.onload = () => {
        const base64String = reader.result as string
        setUploadedImage(base64String)
        form.setValue('descriptionImage', base64String)
      }
      reader.readAsDataURL(file)

      // In a real app, you would upload to a cloud service here
      // For now, we'll just use the base64 string
      
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle image removal
  const handleImageRemove = () => {
    setUploadedImage(null)
    form.setValue('descriptionImage', '')
  }

  // Handle form submission with validation
  const handleSubmit = (values: PostFormValues) => {
    const payload: PostFormData = {
      ...values,
      type,
      // Combine item name with content for better context
      content: `${values.itemName} — ${values.content}`.trim(),
      category: values.category,
      descriptionImage: values.descriptionImage || "",
    }
    
    onSubmit(payload)
    form.reset() // Reset form after successful submission
    setUploadedImage(null) // Clear uploaded image
  }

  const isLost = type === "lost"

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className={`text-xl ${isLost ? "text-destructive" : "text-emerald-600"}`}>
          Report {isLost ? "Lost" : "Found"} Item
        </CardTitle>
        <CardDescription className="text-sm">
          {isLost
            ? "Help us help you find your lost item by providing detailed information"
            : "Help reunite someone with their lost item by reporting what you found"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            
            {/* Two Column Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                {/* Item Name Field */}
                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Item Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Black Wallet, AirPods"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Category Field */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Date Field */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        When did you {isLost ? "lose" : "find"} it?
                      </FormLabel>
                      <FormControl>
                        <Input type="date" className="h-9" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Within the last 30 days
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Contact Phone Field */}
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Contact Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        For WhatsApp contact
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Location Field */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Where did you {isLost ? "lose" : "find"} it?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Library, Cafeteria, Room 101"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Be as specific as possible
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Item Description Field */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe color, brand, size, distinctive features..."
                          rows={2}
                          className="min-h-[60px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Detailed description for identification
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Image Upload Field */}
                <FormField
                  control={form.control}
                  name="descriptionImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Item Image (Optional)</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {/* Upload Button */}
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={isUploading}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-9 border-dashed"
                              disabled={isUploading}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {isUploading ? "Uploading..." : "Upload Image"}
                            </Button>
                          </div>
                          
                          {/* Image Preview/Showcase */}
                          {uploadedImage && (
                            <div className="relative">
                              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 bg-gray-50">
                                <div className="flex items-start gap-3">
                                  {/* Image Preview */}
                                  <div className="relative flex-shrink-0">
                                    <img
                                      src={uploadedImage}
                                      alt="Item preview"
                                      className="w-20 h-20 object-cover rounded-md border"
                                    />
                                    {/* Remove Button */}
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                                      onClick={handleImageRemove}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  
                                  {/* Image Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 text-sm font-medium text-green-700">
                                      <ImageIcon className="w-4 h-4" />
                                      Image uploaded successfully
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                      Click the × button to remove this image
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Alternative URL Input */}
                          <div className="text-xs text-center text-gray-500">
                            or
                          </div>
                          <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="h-9"
                            value={uploadedImage ? "" : field.value || ""}
                            onChange={(e) => {
                              if (!uploadedImage) {
                                field.onChange(e.target.value)
                              }
                            }}
                            disabled={!!uploadedImage}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Upload an image or paste an image URL
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button - Full Width */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={`w-full h-10 ${
                  isLost 
                    ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {form.formState.isSubmitting 
                  ? "Submitting..." 
                  : `Report ${isLost ? "Lost" : "Found"} Item`
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}