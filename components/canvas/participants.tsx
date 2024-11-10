'use client'

import { useOthers, useSelf } from '@liveblocks/react'

import { connectionIdToColor } from '@/lib/utils'

import { ActionTooltip } from '@/components/shared/workspace/action-tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const MAX_SHOWN_USERS = 2

export const Participants = () => {
  const users = useOthers()
  const currentUser = useSelf()
  const hasMoreUsers = users.length > MAX_SHOWN_USERS

  return (
    <div className="h-12 top-2 right-2 rounded-md p-3 flex items-center shadow-md pointer-events-auto">
      <div className="flex gap-x-2">
        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              key={connectionId}
              src={info?.picture}
              name={info?.name}
              fallback={info?.name?.[0]}
              borderColor={connectionIdToColor(connectionId)}
            />
          )
        })}

        {currentUser && (
          <UserAvatar
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            fallback={currentUser.info?.name?.[0]}
            borderColor={connectionIdToColor(currentUser.connectionId)}
          />
        )}

        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  )
}

export const UserAvatar = ({
  src,
  name,
  fallback,
  borderColor,
}: {
  src?: string
  name: string
  fallback?: string
  borderColor?: string
}) => {
  return (
    <ActionTooltip label={name} side="left">
      <Avatar className="h-8 w-8 border-2" style={{ borderColor }}>
        <AvatarImage src={src} />
        <AvatarFallback className="text-xs font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </ActionTooltip>
  )
}
