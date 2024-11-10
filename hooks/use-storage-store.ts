/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useRoom } from '@liveblocks/react/suspense'
import { useEffect, useState } from 'react'
import {
  DocumentRecordType,
  type IndexKey,
  InstancePresenceRecordType,
  PageRecordType,
  type TLAnyShapeUtilConstructor,
  type TLDocument,
  type TLInstancePresence,
  type TLPageId,
  type TLRecord,
  type TLStoreEventInfo,
  type TLStoreWithStatus,
  computed,
  createPresenceStateDerivation,
  createTLStore,
  defaultShapeUtils,
  react,
} from 'tldraw'

type User = {
  id: string
  name: string
  picture: string
}

interface StorageStoreProps {
  shapeUtils?: TLAnyShapeUtilConstructor[]
  user?: User
}

export function useStorageStore({ shapeUtils = [], user }: StorageStoreProps) {
  const room = useRoom()

  const [store] = useState(() => {
    return createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
    })
  })

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: 'loading',
  })

  useEffect(() => {
    const unsubs: Array<() => void> = []
    setStoreWithStatus({ status: 'loading' })

    async function setup() {
      const { root } = await room.getStorage()
      const liveRecords = root.get('records')

      store.clear()
      store.put(
        [
          DocumentRecordType.create({
            id: 'document:document' as TLDocument['id'],
          }),
          PageRecordType.create({
            id: 'page:page' as TLPageId,
            name: 'Page 1',
            index: 'a1' as IndexKey,
          }),
          ...Array.from(liveRecords.values() as Iterable<TLRecord>),
        ],
        'initialize'
      )

      unsubs.push(
        store.listen(
          ({ changes }: TLStoreEventInfo) => {
            room.batch(() => {
              Object.values(changes.added).forEach((record) => {
                liveRecords.set(record.id, record)
              })

              Object.values(changes.updated).forEach(([_, record]) => {
                liveRecords.set(record.id, record)
              })

              Object.values(changes.removed).forEach((record) => {
                liveRecords.delete(record.id)
              })
            })
          },
          { source: 'user', scope: 'document' }
        )
      )

      function syncStoreWithPresence({ changes }: TLStoreEventInfo) {
        room.batch(() => {
          Object.values(changes.added).forEach((record) => {
            room.updatePresence({ [record.id]: record })
          })

          Object.values(changes.updated).forEach(([_, record]) => {
            room.updatePresence({ [record.id]: record })
          })

          Object.values(changes.removed).forEach((record) => {
            room.updatePresence({ [record.id]: null })
          })
        })
      }

      unsubs.push(
        store.listen(syncStoreWithPresence, {
          source: 'user',
          scope: 'session',
        })
      )

      unsubs.push(
        store.listen(syncStoreWithPresence, {
          source: 'user',
          scope: 'presence',
        })
      )

      unsubs.push(
        room.subscribe(
          liveRecords,
          (storageChanges) => {
            const toRemove: TLRecord['id'][] = []
            const toPut: TLRecord[] = []

            for (const update of storageChanges) {
              if (update.type !== 'LiveMap') continue

              for (const [id, { type }] of Object.entries(update.updates)) {
                if (type === 'delete') {
                  toRemove.push(id as TLRecord['id'])
                } else if (type === 'update') {
                  const curr = update.node.get(id)
                  if (curr) toPut.push(curr as TLRecord)
                }
              }
            }

            store.mergeRemoteChanges(() => {
              if (toRemove.length) store.remove(toRemove)
              if (toPut.length) store.put(toPut)
            })
          },
          { isDeep: true }
        )
      )

      const userPreferences = computed<User>('userPreferences', () => {
        if (!user) throw new Error('User is undefined')
        return user
      })

      const connectionIdString = `${room.getSelf()?.connectionId ?? 0}`
      const presenceDerivation = createPresenceStateDerivation(
        userPreferences,
        InstancePresenceRecordType.createId(connectionIdString)
      )(store)

      room.updatePresence({
        presence: presenceDerivation.get() ?? null,
      })

      unsubs.push(
        react('when presence changes', () => {
          const presence = presenceDerivation.get() ?? null
          requestAnimationFrame(() => {
            room.updatePresence({ presence })
          })
        })
      )

      unsubs.push(
        room.subscribe('others', (others, event) => {
          const toRemove: TLInstancePresence['id'][] = []
          const toPut: TLInstancePresence[] = []

          if (event.type === 'leave' && event.user.connectionId) {
            toRemove.push(
              InstancePresenceRecordType.createId(`${event.user.connectionId}`)
            )
          } else if (event.type === 'reset') {
            others.forEach((other) => {
              toRemove.push(
                InstancePresenceRecordType.createId(`${other.connectionId}`)
              )
            })
          } else if (event.type === 'enter' || event.type === 'update') {
            const presence = event.user.presence
            if (presence?.presence) toPut.push(presence?.presence)
          }

          store.mergeRemoteChanges(() => {
            if (toRemove.length) store.remove(toRemove)
            if (toPut.length) store.put(toPut)
          })
        })
      )

      setStoreWithStatus({
        store,
        status: 'synced-remote',
        connectionStatus: 'online',
      })
    }

    setup().catch(console.error)

    return () => {
      unsubs.forEach((fn) => fn())
      unsubs.length = 0
    }
  }, [room, store])

  return storeWithStatus
}
