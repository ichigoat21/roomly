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