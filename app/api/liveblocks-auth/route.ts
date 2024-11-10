import { Liveblocks } from '@liveblocks/node'
import { type NextRequest } from 'next/server'

import { type Doc, type Id } from '@/convex/_generated/dataModel'

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

export async function POST(request: NextRequest) {
  const { room, user, canvas, workspaceId } = (await request.json()) as {
    room: string
    user: Doc<'users'>
    canvas: Doc<'canvas'>
    workspaceId: Id<'workspaces'>
  }

  if (!user) {
    return new Response('Unauthorized', { status: 403 })
  }

  if (canvas.workspaceId !== workspaceId) {
    return new Response('Unauthorized', { status: 403 })
  }

  const userInfo = {
    name: user.name!,
    picture: user.image!,
  }

  const session = liveblocks.prepareSession(user._id, { userInfo })

  if (room) {
    session.allow(room, session.FULL_ACCESS)
  }

  const { status, body } = await session.authorize()
  return new Response(body, { status })
}
