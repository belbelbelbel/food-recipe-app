"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMealPlan } from "@/lib/firebase/meal-plans"
import { handleError, showSuccess } from "@/lib/error-handler"

interface CreateMealPlanDialogProps {
  onSuccess?: () => void
  children: React.ReactNode
}

export function CreateMealPlanDialog({ onSuccess, children }: CreateMealPlanDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      handleError(new Error("Please enter a meal plan name"), "Validation Error")
      return
    }

    try {
      setLoading(true)
      await createMealPlan(title.trim(), description.trim())
      showSuccess(`"${title}" meal plan created!`, "Success")
      setOpen(false)
      setTitle("")
      setDescription("")
      onSuccess?.()
    } catch (error) {
      handleError(error, "Failed to create meal plan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Meal Plan</DialogTitle>
          <DialogDescription>
            Give your meal plan a name and optional description to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meal Plan Name *</Label>
            <Input
              id="title"
              placeholder="e.g., My Weekly Plan, Summer Meals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description for your meal plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Meal Plan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

