'use client'

import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { useEdgeStore } from '@/lib/edgestore'

import { SingleImageDropzone } from '@/components/single-image-dropzone'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { api } from '@/convex/_generated/api'

export default function CreateWorkspacePage() {
  const router = useRouter()
  const { edgestore } = useEdgeStore()

  const [name, setName] = useState('')
  const [file, setFile] = useState<File>()
  const [imageUrl, setImageUrl] = useState<undefined | string>(undefined)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (file?: File) => {
    if (!file) return
    setLoading(true)
    setFile(file)

    const res = await edgestore.publicFiles.upload({
      file,
    })
    setImageUrl(res.url)
    setLoading(false)
  }

  const createWorkspace = useMutation(api.documents.createWorkspace)

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault()

    const promise = createWorkspace({ name, image: imageUrl! }).then(
      (workspaceId) => router.push(`/workspace/${workspaceId}`)
    )

    toast.promise(promise, {
      loading: 'Creating a new workspace...',
      success: 'New workspace created',
      error: 'Failed to create a new workspace',
    })
  }

  return (
    <div className="p-4 w-full min-h-screen flex items-center justify-center">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Create a new workspace</CardTitle>
          <CardDescription>
            Enter a name and upload an image to create your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateWorkspace}
            className="grid w-full items-center gap-4"
          >
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                type="text"
                id="name"
                placeholder="Enter workspace name"
              />
            </div>
            <SingleImageDropzone
              className="w-full outline-none"
              disabled={loading}
              value={file}
              onChange={handleImageUpload}
            />
            <Button disabled={loading} type="submit" className="w-full">
              Create
            </Button>
            <Button
              variant={'secondary'}
              onClick={() => router.back()}
              disabled={loading}
              className="w-full"
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
