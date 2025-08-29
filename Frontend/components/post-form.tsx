"use client"

import type React from "react"
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
    .url("Please enter a valid URL")
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
  }

  const isLost = type === "lost"

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className={isLost ? "text-destructive" : "text-emerald-600"}>
          Report {isLost ? "Lost" : "Found"} Item
        </CardTitle>
        <CardDescription>
          {isLost
            ? "Help us help you find your lost item by providing detailed information"
            : "Help reunite someone with their lost item by reporting what you found"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Item Name Field */}
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Black Wallet, AirPods Gen 3, Blue Hoodie"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a brief, descriptive name for the item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Item Description Field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the item in detail - color, brand, size, distinctive features, etc."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed description to help with identification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      When did you {isLost ? "lose" : "find"} it?
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Date must be within the last 30 days
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Field */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Where did you {isLost ? "lose" : "find"} it?
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Library, Cafeteria, Parking Lot, Room 101"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be as specific as possible about the location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Optional Image Field */}
            <FormField
              control={form.control}
              name="descriptionImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Image (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add an image URL if you have a photo of the item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Phone Field */}
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone (for WhatsApp)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="e.g., +91 98765 43210"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your number will be used to generate a WhatsApp contact link
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className={`w-full ${
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
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}