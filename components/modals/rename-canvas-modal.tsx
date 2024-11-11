'use client'

import { useMutation } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { api } from '@/convex/_generated/api'
import { type Doc, type Id } from '@/convex/_generated/dataModel'

interface ConfirmModalProps {
  children: React.ReactNode
  canvas: Doc<'canvas'>
  workspaceId: Id<'workspaces'>
}

export default function RenameCanvasModal({
  children,
  canvas,
  workspaceId,
}: ConfirmModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(canvas.title)

  const renameCanvas = useMutation(api.canvas.renameCanvas)

  const handleRenameCanvas = () => {
    if (!title) return

    const promise = renameCanvas({
      canvasId: canvas._id,
      workspaceId,
      title,
    })

    toast.promise(promise, {
      loading: 'Renaming canvas...',
      success: 'Canvas rename',
      error: ' Failed to rename canvas',
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Enter a new name for your canvas. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleRenameCanvas}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
