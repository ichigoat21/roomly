"use client"

import { useSearchParams } from "next/navigation";
import DashboardPage from "./dashboard";
import { useEffect } from "react";

export default function App(){
    const params = useSearchParams()
    useEffect(()=> {
        const token = params.get("token")
        localStorage.setItem( "token", token!)
    }, [])
    return <DashboardPage/>
}