'use client'

import { useSelf } from '@liveblocks/react/suspense'
import { type TLComponents, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

import CanvasActions from '@/components/canvas/canvas-actions'
import { Participants } from '@/components/canvas/participants'

import { useStorageStore } from '@/hooks/use-storage-store'

const components: TLComponents = {
  SharePanel: CustomShareZone,
  TopPanel: CustomTopZone,
}

export function StorageTldraw() {
  const id = useSelf((me) => me.id)
  const info = useSelf((me) => me.info)

  const store = useStorageStore({
    user: { id, name: info.name, picture: info.picture },
  })

  return (
    <div className="h-[calc(100vh-56px)] md:h-[100vh] relative z-20">
      <Tldraw store={store} components={components} autoFocus />
    </div>
  )
}

function CustomTopZone() {
  return <CanvasActions />
}

function CustomShareZone() {
  return <Participants />
}
