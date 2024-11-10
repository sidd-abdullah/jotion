'use client'

import { useParams } from 'next/navigation'

import { Room } from '@/components/canvas/room'
import { StorageTldraw } from '@/components/canvas/storage-tldraw'

import { type Id } from '@/convex/_generated/dataModel'

export default function CanvasIdPage() {
  const params = useParams()
  const canvasId = params?.canvasId as Id<'canvas'>

  return (
    <Room roomId={canvasId}>
      <StorageTldraw />
    </Room>
  )
}
