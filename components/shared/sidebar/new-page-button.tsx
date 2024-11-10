import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useSidebarStore } from '@/lib/use-sidebar-store'

import { Button } from '@/components/ui/button'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'

export default function NewPageButton() {
  const router = useRouter()
  const params = useParams()
  const { setOpen } = useSidebarStore()

  const workspaceId = params?.workspaceId as Id<'workspaces'>

  const createDocument = useMutation(api.documents.createDocument)

  const handleCreateDocument = () => {
    const promise = createDocument({ workspaceId }).then((documentId) => {
      router.push(`/workspace/${workspaceId}/document/${documentId}`)
      setOpen(false)
    })

    toast.promise(promise, {
      loading: 'Creating a new document...',
      success: 'New document created',
      error: 'Failed to create a new document',
    })
  }

  return (
    <Button
      onClick={handleCreateDocument}
      variant={'custom'}
      size={'sm'}
      className="w-full justify-start"
    >
      <PlusCircle className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      New Page
    </Button>
  )
}
