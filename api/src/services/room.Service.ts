import { client } from "../lib/lib";

export const handleRoomCreate = async (userId : string, slug : string)=>{
    try {
        const room = await client.rooms.create({
            data : {
                slug : slug,
                
            }
        })
        await client.roomMembers.create({
            data : {
                userId : userId,
                roomId : room.id,
                role : 'ADMIN'
            }
        })
        return room.id
    } catch (err){
        console.log(err)
        return "something went wrong"
       
    }
}

export const handleRoomJoin = async (userId : string, roomId : number)=>{
    const Id = roomId
    const existing = await client.roomMembers.findUnique({
        where: {
            userId_roomId: {
                userId,
                roomId: Id
            }
        }
    })
    
    if (existing) {
        return "Already joined"
    }
    
        
        const room = await client.rooms.findFirst({
            where : {
                id : Id
            }
        })
        const member = await client.roomMembers.create({
            data : {
                userId : userId,
                roomId : Id,
                role : "MEMBER"
            }
        })
        const messages = await client.chats.findMany({
            where :   { id : Id}, 
            orderBy : { id : "desc"},
            take : 50
        })
        return {
            memberId: member.id,
            slug: room?.slug,
            messages : messages
        }
    
}