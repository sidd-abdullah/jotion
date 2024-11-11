import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

const MemberRoles = ['ADMIN', 'MODERATOR', 'GUEST'] as const

export const createCanvas = mutation({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error('Not found')
    }

    const canvas = await ctx.db.insert('canvas', {
      userId,
      workspaceId: args.workspaceId,
      title: 'Untitled',
    })

    return canvas
  },
})

export const getCanvasById = query({
  args: {
    workspaceId: v.id('workspaces'),
    canvasId: v.id('canvas'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) {
      throw new Error('Not found')
    }

    const canvas = await ctx.db.get(args.canvasId)

    if (!canvas) {
      throw new Error('Not found')
    }

    return canvas
  },
})

export const deleteCanvas = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    canvasId: v.id('canvas'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) {
      throw new Error('Not found')
    }

    const canvas = await ctx.db.get(args.canvasId)

    if (!canvas) {
      throw new Error('Not found')
    }

    return await ctx.db.delete(args.canvasId)
  },
})

export const renameCanvas = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    canvasId: v.id('canvas'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) {
      throw new Error('Not found')
    }

    const canvas = await ctx.db.get(args.canvasId)

    if (!canvas) {
      throw new Error('Not found')
    }

    return await ctx.db.patch(args.canvasId, {
      title: args.title,
    })
  },
})

export const addMember = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    role: v.union(...MemberRoles.map((role) => v.literal(role))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error('Not found')
    }

    const existingMember = await ctx.db
      .query('members')
      .withIndex('by_workspace_and_user', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .first()

    if (existingMember) {
      return existingMember
    }

    const member = await ctx.db.insert('members', {
      workspaceId: args.workspaceId,
      userId: userId,
      role: args.role,
    })

    return member
  },
})
