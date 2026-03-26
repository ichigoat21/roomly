"use client"
import AuthComponent from "./auth";



export default function AuthPage(){
    function onGoogleSignIn(){
        window.location.href = "http://localhost:3000/auth/google"
    }
    return <AuthComponent onGoogleSignIn={onGoogleSignIn}/>
}