import RoomClient from "@/components/pages/roomClient";
 
export default async function Page({
  params,
}: {
  params: { roomID: string };
}) {
  const { roomID } = await params;
 
  return <RoomClient roomID={roomID} />;
}
 