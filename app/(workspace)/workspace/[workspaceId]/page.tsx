'use client'

import { useMutation, useQuery } from 'convex/react'
import { FileText, LayoutGrid, StickyNote } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import DocumentSidebar from '@/components/shared/sidebar/document-sidebar'
import MobileSidebar from '@/components/shared/sidebar/mobile-sidebar'
import WorkspaceSidebar from '@/components/shared/workspace/workspace-sidebar'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'

export default function WorkspaceIdPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params?.workspaceId as Id<'workspaces'>

  const createCanvas = useMutation(api.canvas.createCanvas)
  const createDocument = useMutation(api.documents.createDocument)
  const workspace = useQuery(api.documents.getWorkspaceById, {
    workspaceId,
  })

  const handleCreateDocument = () => {
    const promise = createDocument({ workspaceId }).then((documentId) =>
      router.push(`/workspace/${workspaceId}/document/${documentId}`)
    )

    toast.promise(promise, {
      loading: 'Creating a new document...',
      success: 'New document created',
      error: 'Failed to create a new document',
    })
  }

  const handleCreateCanvas = () => {
    const promise = createCanvas({ workspaceId }).then((canvasId) =>
      router.push(`/workspace/${workspaceId}/canvas/${canvasId}`)
    )

    toast.promise(promise, {
      loading: 'Creating a new canvas...',
      success: 'New canvas created',
      error: 'Failed to create a new canvas',
    })
  }

  return (
    <div className="min-h-screen">
      <div className="w-[72px] min-h-screen hidden md:flex fixed inset-y-0 z-40">
        <WorkspaceSidebar />
      </div>
      <div className="w-72 min-h-screen hidden md:flex fixed inset-y-0 z-30 pl-[72px]">
        <DocumentSidebar />
      </div>
      <main className="md:pl-[288px] min-h-screen bg-white dark:bg-[#36393f]">
        <MobileSidebar />
        <div className="w-full min-h-[calc(100vh-56px)] md:min-h-screen flex flex-col items-center justify-center">
          <Image
            src="/document.png"
            priority
            fetchPriority="high"
            loading="eager"
            height="300"
            width="300"
            alt="Empty"
          />
          {workspace === undefined ? (
            <SkeltonData />
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              <WorkspaceCard
                title="Create Document"
                icon={<FileText className="h-6 w-6 text-blue-500" />}
                onClick={handleCreateDocument}
              />
              <WorkspaceCard
                title="Create Canvas"
                icon={<LayoutGrid className="h-6 w-6 text-green-500" />}
                onClick={handleCreateCanvas}
              />
              {/* TODO: need to work on this in future */}
              {/* <WorkspaceCard
                title="Create Board"
                icon={<StickyNote className="h-6 w-6 text-yellow-500" />}
                onClick={handleCreateDocument}
              /> */}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function WorkspaceCard({
  title,
  icon,
  onClick,
}: {
  title: string
  icon: JSX.Element
  onClick: () => void
}) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer w-64 p-4 hover:shadow-lg transition dark:bg-muted"
    >
      <CardHeader className="flex items-center justify-center space-x-2">
        {icon}
        <CardTitle className="whitespace-nowrap">{title}</CardTitle>
      </CardHeader>
    </Card>
  )
}

function SkeltonData() {
  return (
    <div className="w-full flex flex-col items-center space-y-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-64 h-32 p-4 rounded-lg bg-muted/20 animate-pulse flex flex-col items-center justify-center space-y-2"
          >
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
