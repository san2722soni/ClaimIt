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

// Mock current user (in real app, this would come from auth)
const currentUser: User = {
  _id: "user1",
  username: "john_doe",
  email: "john.doe@university.edu",
  avatar: "https://example.com/avatar.jpg",
  phone: "+91 9876543210", // demo phone for WA
};

export default function LostFoundDashboard() {
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="rounded-3xl bg-primary text-primary-foreground p-6 md:p-8 mb-8 shadow-md border border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                Lost &amp; Found Hub
              </h1>
              <p className="mt-2 text-sm md:text-base opacity-90">
                A colorful, modern hub for students to report lost items and
                claim found ones.
              </p>
            </div>
            <picture>
              <img
                src={
                  "/placeholder.svg?height=120&width=180&query=undraw%20lost%20and%20found%20illustration"
                }
                alt="Lost and found illustration"
                className="h-28 w-auto"
              />
            </picture>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

            <div className="rounded-xl border bg-card p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-balance">
                  Find it faster
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Use clear photos and precise locations. Others can quickly
                  contact you via WhatsApp.
                </p>
              </div>
              <picture>
                <img
                  src={
                    "/placeholder.svg?height=120&width=180&query=undraw%20lost%20and%20found%20illustration"
                  }
                  alt="Lost and found illustration"
                  className="h-28 w-auto"
                />
              </picture>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
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
  );
}
