import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const MemberRoles = ['ADMIN', 'MODERATOR', 'GUEST'] as const

export default defineSchema({
  ...authTables,

  workspaces: defineTable({
    userId: v.string(),
    name: v.string(),
    image: v.string(),
  }).index('by_user', ['userId']),

  members: defineTable({
    workspaceId: v.string(),
    userId: v.string(),
    role: v.union(...MemberRoles.map((role) => v.literal(role))),
  }).index('by_workspace_and_user', ['workspaceId', 'userId']),

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
