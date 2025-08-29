"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post-card";
import { PostForm } from "@/components/post-form";
import { SearchFilter } from "@/components/search-filter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, Post, PostFormData } from "@/components/types";
import { useRouter } from "next/navigation";
import { User, UserRound } from "lucide-react";
import {toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SvgIllustration } from "@/components/illustration";

// Mock current user (in real app, this would come from auth)
const currentUser: User = {
  _id: "user1",
  username: "john_doe",
  email: "john.doe@university.edu",
  avatar: "https://example.com/avatar.jpg",
  phone: "+91 9876543210", // demo phone for WA
};

export default function LostFoundDashboard() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handlePostSubmit = (postData: PostFormData) => {
    const newPost: Post = {
      _id: Date.now().toString(),
      owner: {
        ...currentUser,
        phone: postData.contactPhone || currentUser.phone,
      },
      content: postData.content,
      descriptionImage: postData.descriptionImage || undefined,
      category: postData.category,
      location: postData.location,
      date: postData.date,
      type: postData.type,
      createdAt: new Date(),
    };
    setPosts([newPost, ...posts]);
    setActiveTab("dashboard");
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesType = selectedType === "all" || post.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full mx-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-md mb-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              {/* <h1 className="text-2xl font-bold text-gray-900">ClaimIt</h1>
               */}
              <picture>
                <img src="/claimit.png" alt="claimit" className="h-16" />
              </picture>
            </div>

            {/* User Button */}
            <UserModal>
              <button className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-gray-800 hover:bg-gray-900 hover:scale-110 duration-300 transition-all mr-8 cursor-pointer">
                <UserRound className="w-5 h-5 text-white" />
              </button>
            </UserModal>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Mobile-friendly Select for tabs */}
            <div className="mb-4 sm:hidden">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="lost">Report Lost</SelectItem>
                  <SelectItem value="found">Report Found</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs List */}
            <TabsList className="hidden sm:grid w-full grid-cols-3 mb-8 bg-card border rounded-lg">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="lost">Report Lost</TabsTrigger>
              <TabsTrigger value="found">Report Found</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <SearchFilter
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                selectedType={selectedType}
                onSearchChange={setSearchTerm}
                onCategoryChange={setSelectedCategory}
                onTypeChange={setSelectedType}
                totalItems={posts.length}
                filteredItems={filteredPosts.length}
              />

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length === 0 ? (
                  <div className="col-span-full text-center py-12 mx-auto">
                    <SvgIllustration
                      src="/lost.svg"
                      alt="lost"
                      className="md:w-md w-64"
                    />
                    <p className="text-gray-700 text-lg mt-8">
                      {posts.length === 0
                        ? "No items reported yet. Be the first to report something!"
                        : "No items match your search criteria."}
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Report Lost Tab */}
            <TabsContent value="lost">
              <PostForm
                type="lost"
                currentUser={currentUser}
                onSubmit={handlePostSubmit}
              />
            </TabsContent>

            {/* Report Found Tab */}
            <TabsContent value="found">
              <PostForm
                type="found"
                currentUser={currentUser}
                onSubmit={handlePostSubmit}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

type UserDetails = {
  username: string;
  email: string;
  phone: string;
};

interface UserData {
  name: string
  email: string
  phone: string
}

interface UserData {
  name: string
  email: string
  phone: string
}

export function UserModal({ children }: { children?: React.ReactNode }) {
  // Persistent user data
  const [userData, setUserData] = useState<UserData>({
    name: "Your Name",
    email: "claimit@gmail.com",
    phone: "+91 987654321"
  })

  // Form state for editing
  const [formData, setFormData] = useState<UserData>(userData)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // const { toast } = useToast()

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateForm = (): boolean => {
    if (formData.name.trim().length < 2) {
      toast({
        title: "Invalid Name",
        description: "Name must be at least 2 characters long",
        variant: "destructive"
      })
      return false
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return false
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(userData) // Reset form data to current user data
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data
      setUserData(formData)
      setIsEditing(false)
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(userData) // Reset to original data
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your profile information" : "View and manage your profile"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              value={formData.name}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`h-9 ${!isEditing ? 'bg-muted cursor-default' : ''}`}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`h-9 ${!isEditing ? 'bg-muted cursor-default' : ''}`}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`h-9 ${!isEditing ? 'bg-muted cursor-default' : ''}`}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="h-9"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="h-9"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <DialogClose asChild>
                <Button variant="outline" type="button" className="h-9">
                  Close
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleEdit}
                className="h-9"
              >
                Edit Profile
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}