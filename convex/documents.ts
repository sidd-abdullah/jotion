import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { internal } from './_generated/api'
import { internalMutation, mutation, query } from './_generated/server'

const MemberRoles = ['ADMIN', 'MODERATOR', 'GUEST'] as const

export const createWorkspace = mutation({
  args: {
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const workspaceId = await ctx.db.insert('workspaces', {
      userId,
      name: args.name,
      image: args.image,
    })

    await ctx.scheduler.runAfter(0, internal.documents.addMember, {
      role: 'GUEST',
      workspaceId,
    })

    return workspaceId
  },
})

export const addMember = internalMutation({
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

    await ctx.db.insert('members', {
      workspaceId: args.workspaceId,
      userId: userId,
      role: args.role,
    })
  },
})

export const getWorkspaces = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const workspaces = await ctx.db
      .query('workspaces')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    return workspaces
  },
})

export const getWorkspaceById = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const { workspaceId } = args
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const workspace = await ctx.db.get(workspaceId)

    if (!workspace) {
      throw new Error('Not found')
    }

    if (workspace?.userId !== userId) {
      throw new Error('Not authenticated')
    }

    return workspace
  },
})

export const createDocument = mutation({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const document = await ctx.db.insert('documents', {
      workspaceId: args.workspaceId,
      userId,
      title: 'Untitled',
      isArchived: false,
      isPublished: false,
    })

    return document
  },
})

export const getDocuments = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const { workspaceId } = args
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_workspace', (q) => q.eq('workspaceId', workspaceId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  },
})

export const archiveDocument = mutation({
  args: {
    id: v.id('documents'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    if (existingDocument.workspaceId !== args.workspaceId) {
      throw new Error('Unauthorized workspace.')
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    })

    return document
  },
})

export const getTrashDocuments = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_workspace', (q) => q.eq('workspaceId', args.workspaceId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect()

    return documents
  },
})

export const removeDocument = mutation({
  args: {
    id: v.id('documents'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    if (existingDocument.workspaceId !== args.workspaceId) {
      throw new Error('Unauthorized workspace.')
    }

    const document = await ctx.db.delete(args.id)

    return document
  },
})

export const restoreDocument = mutation({
  args: {
    id: v.id('documents'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    if (existingDocument.workspaceId !== args.workspaceId) {
      throw new Error('Unauthorized workspace.')
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: false,
    })

    return document
  },
})

export const getDocumentById = query({
  args: {
    documentId: v.id('documents'),
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

    const document = await ctx.db.get(args.documentId)

    if (!document) {
      throw new Error('Not found')
    }

    if (document.workspaceId !== args.workspaceId) {
      throw new Error('Unauthorized workspace.')
    }

    if (document.userId !== userId) {
      throw new Error('Unauthorized')
    }

    return document
  },
})

export const updateDocument = mutation({
  args: {
    id: v.id('documents'),
    workspaceId: v.id('workspaces'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const { id, ...rest } = args

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error('Not found')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.workspaceId !== args.workspaceId) {
      throw new Error('Unauthorized')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }
    const document = await ctx.db.patch(args.id, {
      ...rest,
    })

    return document
  },
})

export const removeIcon = mutation({
  args: {
    id: v.id('documents'),
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

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.workspaceId !== args.workspaceId) {
      throw new Error('Unauthorized workspace.')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    })

    return document
  },
})

export const removeCoverImage = mutation({
  args: {
    id: v.id('documents'),
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

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.workspaceId !== args.workspaceId) {
      throw new Error('Unauthorized workspace.')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    })

    return document
  },
})

export const getPreviewDocumentById = query({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId)

    if (!document) {
      throw new Error('Document not found')
    }

    if (document.isPublished && !document.isArchived) {
      return document
    } else {
      throw new Error('Document not available for preview')
    }
  },
})
