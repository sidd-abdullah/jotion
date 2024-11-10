import { useQuery } from 'convex/react'
import { File, Search } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function SearchButton() {
  const router = useRouter()
  const params = useParams()
  const { user } = useCurrentUser()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const workspaceId = params?.workspaceId as Id<'workspaces'>

  const documents = useQuery(api.documents.getDocuments, { workspaceId })

  if (documents === undefined) {
    return <Skeleton className="w-full px-4 py-4" />
  }

  const onSelect = (id: string) => {
    router.push(`/workspace/${workspaceId}/document/${id}`)
    setOpen(false)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={'custom'}
        size={'sm'}
        className="w-full justify-start"
      >
        <Search className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        Search
        <kbd className="ml-auto rounded bg-slate-200 px-1 dark:bg-slate-600">
          <span className="text-xs">⌘</span> K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={`Search ${user?.name}'s Noted...`} />
        <CommandList>
          {documents.length > 0 ? (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Documents">
                {documents?.map((document) => (
                  <CommandItem
                    key={document._id}
                    value={`${document._id}-${document.title}`}
                    title={document.title}
                    onSelect={() => onSelect(document._id)}
                  >
                    {document.icon ? (
                      <p className="mr-2 text-[18px]">{document.icon}</p>
                    ) : (
                      <File className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    )}
                    <span>{document.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : (
            <div className="py-6 text-center text-sm">
              <Label>No documents to search.</Label>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
