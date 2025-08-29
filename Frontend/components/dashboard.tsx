"use client"
import Image from "next/image"
import { useMemo, useState } from "react"
import type { Post } from "./types"
import { PostForm } from "./post-form"
import { PostCard } from "./post-card"
import { SearchFilter } from "./search-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const DEMO_POSTS: Post[] = [
  {
    id: "1",
    type: "Lost",
    itemName: "Black Wallet",
    description: "Lost near the cafeteria. Contains student ID and some cash.",
    location: "Main Cafeteria",
    dateISO: "2025-08-20",
    category: "ID Cards",
    imageUrl: "/lost-wallet-on-table.png",
    contactName: "Ayesha",
    contactPhone: "+91 98765 43210",
  },
  {
    id: "2",
    type: "Found",
    itemName: "AirPods (Gen 3)",
    description: "Found in the library silent zone. Describe the case sticker to claim.",
    location: "Library - Silent Zone",
    dateISO: "2025-08-21",
    category: "Electronics",
    imageUrl: "/airpods-on-desk.png",
    contactName: "Rahul",
    contactPhone: "+91 99887 77665",
  },
  {
    id: "3",
    type: "Lost",
    itemName: "Blue Hoodie",
    description: "Left after evening sports practice.",
    location: "Gym Building A",
    dateISO: "2025-08-22",
    category: "Clothing",
    imageUrl: "/blue-hoodie-gym.png",
    contactName: "Maya",
    contactPhone: "+1 555 0142",
  },
]

type Filters = {
  q: string
  type: "All" | "Lost" | "Found"
  category: "All" | "ID Cards" | "Electronics" | "Stationery" | "Clothing" | "Other"
}

export function Dashboard() {
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS)
  const [filters, setFilters] = useState<Filters>({ q: "", type: "All", category: "All" })

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesType = filters.type === "All" || p.type === filters.type
      const matchesCat = filters.category === "All" || p.category === filters.category
      const q = filters.q.trim().toLowerCase()
      const matchesQ =
        q.length === 0 ||
        [p.itemName, p.description, p.location, p.category, p.type].some((s) => s.toLowerCase().includes(q))
      return matchesType && matchesCat && matchesQ
    })
  }, [posts, filters])

  function handleAdd(post: Post) {
    setPosts((prev) => [post, ...prev])
    // In the real backend, post to Express API and MongoDB.
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <header className="mb-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">Lost & Found Hub</h1>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              Report lost or found items, search the board, and contact via WhatsApp to quickly reunite items with
              owners.
            </p>
          </div>
          <div className="relative h-24 w-full max-w-xs md:h-28">
            <Image
              src="/undraw-illustration-lost-and-found.png"
              alt="Illustration of lost and found"
              fill
              sizes="200px"
              className="object-contain"
            />
          </div>
        </div>
      </header>

      {/* Tabs: Browse / Report */}
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <SearchFilter value={filters} onChange={setFilters} total={posts.length} posts={filtered} />
          <section aria-label="Items grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
            {filtered.length === 0 ? (
              <div className="col-span-full rounded-lg border p-8 text-center">
                <p className="text-sm text-muted-foreground">No items match your filters. Try adjusting the search.</p>
              </div>
            ) : null}
          </section>

          {/* Secondary undraw illustration band */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-lg">
                <h2 className="text-pretty text-lg font-medium">Tips for better matches</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Include unique details (stickers, keychains, engravings) when you post. This helps others identify
                  items faster and avoid confusion.
                </p>
              </div>
              <div className="relative h-24 w-40 sm:h-28 sm:w-48">
                <Image
                  src="/undraw-searching-illustration.png"
                  alt="Illustration of searching"
                  fill
                  sizes="200px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <PostForm onAdd={handleAdd} />
          <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">
            Your post will appear instantly here for demo. Tomorrow, connect this to your Express + MongoDB API.
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer action */}
      <div className="mt-10 flex items-center justify-center">
        <Button variant="outline" asChild>
          <a href="#top">Back to top</a>
        </Button>
      </div>
    </div>
  )
}
