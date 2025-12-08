"use client"

import { useState, useEffect } from "react"
import { Loader2, UserPlus, X, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { searchUsersByEmail, addCollaboratorToMealPlan, removeCollaboratorFromMealPlan, type UserMealPlan } from "@/lib/firebase/meal-plans"
import { getUserProfile } from "@/lib/firebase/auth"
import { handleError, showSuccess } from "@/lib/error-handler"
import { useDebounce } from "@/hooks/use-debounce"

interface AddCollaboratorDialogProps {
  plan: UserMealPlan
  onSuccess?: () => void
  children: React.ReactNode
}

interface CollaboratorInfo {
  uid: string
  email: string
  displayName?: string
}

export function AddCollaboratorDialog({ plan, onSuccess, children }: AddCollaboratorDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CollaboratorInfo[]>([])
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 500)

  // Load existing collaborators
  useEffect(() => {
    if (open && plan.collaborators && plan.collaborators.length > 0) {
      loadCollaborators()
    } else if (open) {
      setCollaborators([])
    }
  }, [open, plan.collaborators])

  // Search users when query changes
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length >= 2) {
      searchUsers()
    } else {
      setSearchResults([])
    }
  }, [debouncedSearch])

  async function loadCollaborators() {
    if (!plan.collaborators || plan.collaborators.length === 0) {
      setCollaborators([])
      return
    }

    try {
      setLoading(true)
      const collaboratorPromises = plan.collaborators.map(async (uid) => {
        const profile = await getUserProfile(uid)
        return {
          uid,
          email: profile?.email || "Unknown",
          displayName: profile?.displayName,
        }
      })
      const loaded = await Promise.all(collaboratorPromises)
      setCollaborators(loaded.filter((c) => c.email !== "Unknown"))
    } catch (error) {
      console.error("Error loading collaborators:", error)
    } finally {
      setLoading(false)
    }
  }

  async function searchUsers() {
    try {
      setSearching(true)
      const results = await searchUsersByEmail(debouncedSearch)
      // Filter out current collaborators and plan owner
      const filtered = results.filter(
        (user) => !plan.collaborators?.includes(user.uid) && user.uid !== plan.userId
      )
      setSearchResults(filtered)
    } catch (error) {
      handleError(error, "Failed to search users")
    } finally {
      setSearching(false)
    }
  }

  async function handleAddCollaborator(userId: string) {
    try {
      setAdding(userId)
      await addCollaboratorToMealPlan(plan.id, userId)
      showSuccess("Collaborator added successfully!", "Success")
      
      // Reload collaborators
      await loadCollaborators()
      
      // Remove from search results
      setSearchResults((prev) => prev.filter((u) => u.uid !== userId))
      setSearchQuery("")
      
      onSuccess?.()
    } catch (error) {
      handleError(error, "Failed to add collaborator")
    } finally {
      setAdding(null)
    }
  }

  async function handleRemoveCollaborator(userId: string) {
    try {
      setRemoving(userId)
      await removeCollaboratorFromMealPlan(plan.id, userId)
      showSuccess("Collaborator removed successfully!", "Success")
      
      // Remove from local state
      setCollaborators((prev) => prev.filter((c) => c.uid !== userId))
      
      onSuccess?.()
    } catch (error) {
      handleError(error, "Failed to remove collaborator")
    } finally {
      setRemoving(null)
    }
  }

  function getInitials(email: string, displayName?: string): string {
    if (displayName) {
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-4 sm:p-6 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Manage Collaborators</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Add people to collaborate on "{plan.title}". They'll be able to view and add meals to this plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-9 text-sm sm:text-base"
              />
            </div>

            {/* Search Results */}
            {searching && (
              <div className="flex items-center justify-center py-3 sm:py-4">
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
              </div>
            )}

            {!searching && searchResults.length > 0 && (
              <div className="border rounded-lg p-2 space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.uid}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-accent rounded-lg gap-2"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">{getInitials(user.email, user.displayName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium truncate">{user.displayName || user.email}</p>
                        {user.displayName && (
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddCollaborator(user.uid)}
                      disabled={adding === user.uid}
                      className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      {adding === user.uid ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!searching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <p className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-4">
                No users found
              </p>
            )}
          </div>

          {/* Current Collaborators */}
          {loading ? (
            <div className="flex items-center justify-center py-3 sm:py-4">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
            </div>
          ) : collaborators.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-semibold">Collaborators</h4>
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <div
                    key={collab.uid}
                    className="flex items-center justify-between p-2 sm:p-3 border rounded-lg gap-2"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">{getInitials(collab.email, collab.displayName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium truncate">{collab.displayName || collab.email}</p>
                        {collab.displayName && (
                          <p className="text-xs text-muted-foreground truncate">{collab.email}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveCollaborator(collab.uid)}
                      disabled={removing === collab.uid}
                      className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      {removing === collab.uid ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-4">
              No collaborators yet. Search for users to add them.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

