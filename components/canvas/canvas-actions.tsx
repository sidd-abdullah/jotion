import { useMutation, useQuery } from 'convex/react'
import { ChevronDown, Link2, Pencil, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import ConfirmModal from '@/components/modals/confirm-modal'
import RenameCanvasModal from '@/components/modals/rename-canvas-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'
import { useOrigin } from '@/hooks/use-origin'

export default function CanvasActions() {
  const router = useRouter()
  const params = useParams()
  const origin = useOrigin()
  const workspaceId = params?.workspaceId as Id<'workspaces'>
  const canvasId = params?.canvasId as Id<'canvas'>

  const canvas = useQuery(api.canvas.getCanvasById, {
    canvasId,
    workspaceId,
  })

  const deleteCanvas = useMutation(api.canvas.deleteCanvas)

  // In future we made this in to invite link. so member first join the worskspace then able to acess that canvas.

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${origin}/workspace/${workspaceId}/canvas/${canvasId}`)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error('Failed to copy link'))
  }

  const handleDeleteCanvas = () => {
    const promise = deleteCanvas({ canvasId, workspaceId })

    toast.promise(promise, {
      loading: 'Deleting canvas...',
      success: 'Canvas deleted',
      error: ' Failed to delete canvas',
    })
    router.push(`/workspace/${workspaceId}`)
  }

  if (canvas === undefined) return null

  return (
    <div className="pointer-events-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-12 rounded-t-none"
            variant={'secondary'}
            size={'lg'}
          >
            {canvas?.title}
            <ChevronDown className="w-4 h-4 ml-2 text-zinc-700 dark:text-zinc-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          className="w-60"
        >
          <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
            <Link2 className="h-4 w-4 mr-2" />
            Copy board link
          </DropdownMenuItem>
          <RenameCanvasModal canvas={canvas} workspaceId={workspaceId}>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-3 cursor-pointer"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
          </RenameCanvasModal>
          <ConfirmModal onConfirm={handleDeleteCanvas}>
            <Button
              className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </ConfirmModal>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
