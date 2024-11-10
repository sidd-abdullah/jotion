'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { ActionTooltip } from '@/components/shared/workspace/action-tooltip'

export default function CreateWorkspaceButton() {
  const router = useRouter()

  return (
    <div>
      <ActionTooltip label="Create Workspace" side="right" align="center">
        <button
          onClick={() => router.push(`/workspace`)}
          className="group flex h-[48px] w-[48px] items-center justify-center rounded-full overflow-hidden transition-all bg-background dark:bg-neutral-700 hover:bg-emerald-500"
        >
          <div className="flex items-center justify-center">
            <Plus
              className="text-emerald-500 group-hover:text-white transition"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
