import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,

  workspaces: defineTable({
    userId: v.string(),
    name: v.string(),
    image: v.string(),
  }).index('by_user', ['userId']),

  documents: defineTable({
    workspaceId: v.string(),
    userId: v.string(),
    title: v.string(),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.string()),
  }).index('by_workspace', ['workspaceId']),

  canvas: defineTable({
    workspaceId: v.string(),
    userId: v.string(),
    title: v.string(),
  }).index('by_workspace', ['workspaceId']),
})
