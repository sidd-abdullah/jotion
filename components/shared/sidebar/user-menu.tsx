import { useAuthActions } from '@convex-dev/auth/react'
import { ChevronsLeftRight, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

import { useCurrentUser } from '@/hooks/use-current-user'

export default function UserMenu() {
  const { signOut } = useAuthActions()
  const router = useRouter()
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return <Skeleton className="w-full px-3 h-12 rounded-none" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button
          className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 
        border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        >
          {user?.name}
          <ChevronsLeftRight className="ml-auto h-4 w-4 rotate-90" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none">{user?.email}</p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="line-clamp-1 text-sm">{user?.name}&apos;s Noted</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void signOut()
            router.push('/auth')
          }}
          className="w-full cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
