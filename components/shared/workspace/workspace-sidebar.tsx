'use client'

import { useQuery } from 'convex/react'

import CreateWorkspaceButton from '@/components/shared/workspace/create-workspace-button'
import NavigationItem from '@/components/shared/workspace/navigation-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { api } from '@/convex/_generated/api'

export default function WorkspaceSidebar() {
  const workspaces = useQuery(api.documents.getWorkspaces)

  return (
    <div className="min-h-screen flex flex-col py-3 space-y-4 items-center text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
      <CreateWorkspaceButton />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="w-full flex-1">
        {workspaces === undefined ? (
          <div className="flex flex-col space-y-2">
            {Array.from({ length: 8 }).map((_, e) => (
              <Skeleton
                key={e}
                className="mx-3 h-[48px] w-[48px] rounded-[24px] bg-zinc-300"
              />
            ))}
          </div>
        ) : (
          workspaces.map((workspace) => (
            <div key={workspace._id} className="mb-4">
              <NavigationItem
                id={workspace._id}
                imageUrl={workspace.image}
                name={workspace.name}
              />
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  )
}
