import { useMutation } from 'convex/react'
import { File, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useSidebarStore } from '@/lib/use-sidebar-store'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/use-current-user'

interface ItemProps {
  id: Id<'documents'>
  label: string
  documentIcon?: string
}

export default function DocumentItem({ id, label, documentIcon }: ItemProps) {
  const router = useRouter()
  const params = useParams()
  const { user } = useCurrentUser()
  const { setOpen } = useSidebarStore()

  const documentId = params?.documentId as Id<'documents'>
  const active = documentId === id
  const workspaceId = params?.workspaceId as Id<'workspaces'>

  const archiveDocument = useMutation(api.documents.archiveDocument)

  const handleArchiveNote = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()
    const promise = archiveDocument({ id, workspaceId })

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Document moved to trash',
      error: 'Failed to archive document',
    })
    router.push(`/workspace/${workspaceId}`)
  }

  const handleRedirect = () => {
    router.push(`/workspace/${workspaceId}/document/${id}`)
    setOpen(false)
  }

  return (
    <Button
      onClick={handleRedirect}
      variant={active ? 'active' : 'custom'}
      size={'sm'}
      className="group w-full cursor-auto items-center justify-start"
    >
      {documentIcon ? (
        <div className="mr-2 h-4 w-4">{documentIcon}</div>
      ) : (
        <File className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      )}
      {label}
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="ml-auto opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60"
          align="start"
          side="right"
          forceMount
        >
          <DropdownMenuItem onClick={handleArchiveNote}>
            <Trash className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user && (
            <div className="p-2 text-xs">Last edited by: {user.name}</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Button>
  )
}
