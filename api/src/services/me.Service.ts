import { client } from "../lib/lib"

export const profileHandler = async (id: string) => {
  try {
    const user = await client.users.findUnique({
      where: { id },
      include: {
        membership: {
          include: {
            room: {
              include: {
                members: true,
                chats: {
                  orderBy: { createdAt: "desc" },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null
      }
    }

    const rooms = user.membership.map((m) => {
      const room = m.room
      const lastChat = room.chats[0]

      return {
        id: room.id,
        name: room.slug,
        memberCount: room.members.length,
        lastMessage: lastChat?.message ?? null,
        lastMessageAt: lastChat?.createdAt ?? null
      }
    })

    return {
      success: true,
      data: {
        user : user,
        username: user.username,
        rooms
      }
    }

  } catch (err) {
    return {
      success: false,
      message: "Something went wrong",
      data: null
    }
  }
}