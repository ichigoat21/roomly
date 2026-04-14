import { client } from "../lib/lib";

export const handleRoomCreate = async (userId: string, slug: string) => {
    try {
        const room = await client.rooms.create({
            data: { slug }
        })
        await client.roomMembers.create({
            data: {
                userId,
                roomId: room.id,
                role: 'ADMIN'
            }
        })
        return room.id
    } catch (err) {
        console.log(err)
        throw new Error("Failed to create room")
    }
}

export const handleRoomJoin = async (userId: string, roomId: number) => {
    // Always fetch the room and messages regardless of membership status
    // The frontend calls this endpoint both when first joining AND when
    // re-entering a room they're already in — both cases need the same data back
    const room = await client.rooms.findUnique({
        where: { id: roomId }
    })

    if (!room) {
        throw new Error("Room not found")
    }

    // Check if already a member — if not, create the membership
    const existing = await client.roomMembers.findUnique({
        where: {
            userId_roomId: { userId, roomId }
        }
    })

    if (!existing) {
        await client.roomMembers.create({
            data: {
                userId,
                roomId,
                role: "MEMBER"
            }
        })
    }

    // Fetch messages with user info so frontend can show avatars + names
    const messages = await client.chats.findMany({
        where: { roomId },
        orderBy: { id: "asc" },   // asc so they render oldest → newest
        take: 50,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                }
            }
        }
    })

    // Fetch current user's info to send back with the response
    const currentUser = await client.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            avatar: true,
        }
    })

    // Fetch all members of the room with their user info
    const members = await client.roomMembers.findMany({
        where: { roomId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                }
            }
        }
    })

    return {
        slug: room.slug,
        // Current user identity — frontend uses these for isOwn + optimistic messages
        currentUserId: currentUser?.id ?? userId,
        currentUserName: currentUser?.username ?? "",
        currentUserAvatar: currentUser?.avatar ?? null,
        messages,
        members: members.map(m => ({
            id: m.user.id,
            name: m.user.username,
            avatarUrl: m.user.avatar,
            isOnline: false, // WebSocket manages real online status
        }))
    }
}