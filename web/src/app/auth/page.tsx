"use client"
import { useRouter } from "next/navigation";
import AuthComponent from "./auth";
import axios from "axios";


type SignupResponse = {
    user: {
        id: string
        email: string
        username: string
    }, 
    token : string
}
type SigninResponse = {
    user: {
        id: string
        email: string
    }, 
    token : string
}


export default function AuthPage(){
    const router = useRouter()

    function onGoogleSignIn(){
        window.location.href = "http://localhost:3000/auth/google"
    }
    async function onSignup(username : string, email : string, password : string){
            try {
                const response = await axios.post<SignupResponse>(
                    "http://localhost:3000/auth/signup",
                    {
                        username,
                        email,
                        password
                    }
                )
        
                const token = response.data.token
                localStorage.setItem("token", token)
                router.push("/dashboard")
                
        
                console.log(token)
        
            } catch (err: any) {
                console.error(err.response?.data?.message || "Signup failed")
            }
    }
    async function onSignin(email :string, password : string){
        try {
            const response = await axios.post<SigninResponse>("http://localhost:3000/auth/signin", ({
            email,
            password
        }))
        const token = response.data.token
        localStorage.setItem("token", token)
        router.push("/dashboard")
    } catch (err : any){
        console.error(err.response?.data?.message || "Signup failed")
    }
        
    }
    return <AuthComponent onGoogleSignIn={onGoogleSignIn} onSignup={onSignup} onLogin={onSignin} />
}