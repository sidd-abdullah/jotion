'use client'

import { LiveMap } from '@liveblocks/core'
import { LiveblocksProvider } from '@liveblocks/react'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { type ReactNode } from 'react'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/use-current-user'

export function Room({
  children,
  roomId,
}: {
  children: ReactNode
  roomId: string
}) {
  const params = useParams()
  const canvasId = params?.canvasId as Id<'canvas'>
  const workspaceId = params?.workspaceId as Id<'workspaces'>

  const canvas = useQuery(api.canvas.getCanvasById, { workspaceId, canvasId })
  const { user, isLoading } = useCurrentUser()

  if (isLoading || !user || canvas === undefined) {
    return <Loading />
  }

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const headers = {
          'Content-Type': 'application/json',
        }

        const body = JSON.stringify({
          user,
          canvas,
          workspaceId,
          room,
        })

        const response = await fetch('/api/liveblocks-auth', {
          method: 'POST',
          headers,
          body,
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await response.json()
      }}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{ presence: undefined }}
        initialStorage={{ records: new LiveMap() }}
      >
        <ClientSideSuspense fallback={<Loading />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}
