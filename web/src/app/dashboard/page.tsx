"use client"

import { useSearchParams } from "next/navigation";
import DashboardPage, { User } from "./dashboard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App(){
    const params = useSearchParams()
    const [user, setUser] = useState<User | null>(null)
    const [rooms, setRooms] = useState([])

    async function fetchUserProfile(token : string){
        const response = await axios.get("http://localhost:3000/profile/me", {
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        setUser({
            name: response.data.username,
            email : response.data.user.email
          })
          setRooms(response.data.rooms)
    }
    useEffect(()=> {
        const urlToken = params.get("token")

        if (urlToken) {
            localStorage.setItem("token", urlToken)
        }

        const token = urlToken || localStorage.getItem("token")

        if (!token) return

        // fetch user + rooms
        fetchUserProfile(token)
       
    }, [params])
    if (!user) return <div>Loading...</div>

    return <DashboardPage currentUser={user} rooms={rooms} />
}