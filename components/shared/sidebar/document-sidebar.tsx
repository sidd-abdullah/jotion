'use client'

import { useQuery } from 'convex/react'
import { Send } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'

import { InviteModal } from '@/components/modals/invite-modal'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import DocumentItem from './document-item'
import NewPageButton from './new-page-button'
import SearchButton from './search-button'
import SettingButton from './setting-button'
import TrashBox from './trash-box'
import UserMenu from './user-menu'
import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'

export default function DocumentSidebar() {
  const params = useParams()
  const pathUrl = usePathname()
  const workspaceId = params?.workspaceId as Id<'workspaces'>

  const documents = useQuery(api.documents.getDocuments, { workspaceId })

  const isShown = pathUrl !== `/workspace/${workspaceId}`

  return (
    <div className="min-h-screen flex flex-col text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <UserMenu />
      <div className="p-1">
        {!isShown && (
          <InviteModal workspaceId={workspaceId}>
            <Button
              variant={'custom'}
              size={'sm'}
              className="w-full justify-start"
            >
              <Send className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              Invite Members
            </Button>
          </InviteModal>
        )}
        {isShown && <NewPageButton />}
        <SettingButton />
        {isShown && <TrashBox />}
        <SearchButton />
      </div>
      <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md w-full" />
      <ScrollArea className="flex-1">
        {documents === undefined ? (
          <div className="space-y-1 p-1 flex flex-col">
            {Array.from({ length: 8 }).map((_, e) => (
              <Skeleton key={e} className="w-full px-4 py-4" />
            ))}
          </div>
        ) : (
          <div className="mr-2 p-1 space-y-1 flex flex-col">
            {/* TODO: need to show the user who join this organization in future */}
            {documents.map((document) => (
              <DocumentItem
                key={document._id}
                id={document._id}
                label={document.title}
                documentIcon={document.icon}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
