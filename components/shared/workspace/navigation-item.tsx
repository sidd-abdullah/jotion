import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

import { ActionTooltip } from '@/components/shared/workspace/action-tooltip'

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
}

export default function NavigationItem({
  id,
  imageUrl,
  name,
}: NavigationItemProps) {
  const params = useParams()
  const router = useRouter()

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={() => router.push(`/workspace/${id}`)} className="group">
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            params?.workspaceId === id &&
              'bg-primary/10 text-primary rounded-[16px] border-2 border-green-500'
          )}
        >
          <Image
            fill
            src={imageUrl}
            className="w-full h-full object-cover"
            alt="Server"
          />
        </div>
      </button>
    </ActionTooltip>
  )
}
