'use client'

import { useMutation, useQuery } from 'convex/react'
import { Search, Trash, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'

export default function TrashBox() {
  const router = useRouter()
  const params = useParams()
  const [search, setSearch] = useState('')
  const workspaceId = params?.workspaceId as Id<'workspaces'>

  const documents = useQuery(api.documents.getTrashDocuments, { workspaceId })
  const removeDocument = useMutation(api.documents.removeDocument)
  const restoreDocument = useMutation(api.documents.restoreDocument)

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase())
  )

  if (documents === undefined) {
    return <Skeleton className="w-full px-4 py-4 mb-1" />
  }

  const handleRemoveDocument = (id: Id<'documents'>) => {
    const promise = removeDocument({ id, workspaceId }).then(() =>
      router.push(`/workspace/${workspaceId}`)
    )

    toast.promise(promise, {
      loading: 'Deleting document...',
      success: 'Document deleted',
      error: ' Failed to delete document',
    })
  }

  const handleRestoreDocument = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: Id<'documents'>
  ) => {
    event.stopPropagation()
    const promise = restoreDocument({ id, workspaceId })

    toast.promise(promise, {
      loading: 'Restoring document...',
      success: 'Document restored',
      error: ' Failed to restore document',
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild className="w-full">
        <Button variant={'custom'} size={'sm'} className="w-full justify-start">
          <Trash className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          Trash
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <div className="flex items-center gap-x-1 p-2">
          <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
            placeholder="Filter by document title..."
          />
        </div>
        <ScrollArea className="h-60">
          <div className="mr-2 space-y-1 p-2">
            <p className="hidden pb-2 text-center text-xs last:block">
              No documents found.
            </p>
            {filteredDocuments?.map((document) => (
              <div
                key={document._id}
                onClick={() =>
                  router.push(
                    `/workspace/${workspaceId}/document/${document._id}`
                  )
                }
                role="button"
                className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5"
              >
                <span className="truncate pl-2">{document.title}</span>
                <div className="flex items-center">
                  <div
                    role="button"
                    onClick={(e) => handleRestoreDocument(e, document._id)}
                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  >
                    <Undo className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <ConfirmModal
                    onConfirm={() => handleRemoveDocument(document._id)}
                  >
                    <div
                      role="button"
                      className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    >
                      <Trash className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    </div>
                  </ConfirmModal>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
