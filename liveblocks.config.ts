import { type LiveMap } from '@liveblocks/core'

declare global {
  interface Liveblocks {
    Presence: {
      // Example, real-time cursor coordinates
      // cursor: { x: number; y: number };
    }

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      records: LiveMap<string, any> // Used by tldraw
    }

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string
      info: {
        name: string
        picture: string
      }
    }

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: object
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    }

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    }
  }
}

export {}
