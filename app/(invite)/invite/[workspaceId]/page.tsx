'use client'

import { useMutation } from 'convex/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import Spinner from '@/components/spinner'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()

  const addMember = useMutation(api.canvas.addMember)

  const workspaceId = params?.workspaceId as Id<'workspaces'>

  useEffect(() => {
    void addMember({ workspaceId, role: 'GUEST' })
    router.push(`/workspace/${workspaceId}`)
  }, [router, workspaceId, addMember])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Spinner />
    </div>
  )
}
