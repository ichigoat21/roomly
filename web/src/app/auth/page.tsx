"use client"
import { useRouter } from "next/navigation";
import AuthComponent from "@/components/pages/auth";
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

// Add a new type for Google sign-in response
type GoogleSignInResponse = {
    user: {
        id: string
        email: string
        username?: string
        isNewUser?: boolean
    }, 
    token : string
}


export default function AuthPage(){
    const router = useRouter()

    function onGoogleSignIn(){
        localStorage.setItem("googleSignInRedirect", "true");
        window.location.href = `${process.env.NEXT_API_URL}/auth/google`
    }
    
    async function onSignup(username : string, email : string, password : string){
            try {
                const response = await axios.post<SignupResponse>(
                    `${process.env.NEXT_API_URL}/auth/signup`,
                    {
                        username,
                        email,
                        password
                    }
                )
        
                const token = response.data.token
                localStorage.setItem("token", token)
                
                // For new user signup, redirect to profile page
                router.push("/profile")
                
                console.log(response.data)
                console.log(token)
        
            } catch (err: any) {
                console.error(err.response?.data?.message || "Signup failed")
            }
    }
    
    async function onSignin(email :string, password : string){
        try {
            const response = await axios.post<SigninResponse>(`${process.env.NEXT_API_URL}/auth/signin`, ({
            email,
            password
        }))
        const token = response.data.token
        localStorage.setItem("token", token)
        
        // For existing user signin, redirect to dashboard
        router.push("/dashboard")
        
    } catch (err : any){
        console.error(err.response?.data?.message || "Signup failed")
    }
        
    }
    
    // You'll also need to handle the Google callback page separately
    // This function should be called in your Google callback route/page
    async function handleGoogleCallback() {
        const shouldCheckNewUser = localStorage.getItem("googleSignInRedirect");
        
        if (shouldCheckNewUser === "true") {
            localStorage.removeItem("googleSignInRedirect");
            
            try {
                // Assuming your backend sends back user data including isNewUser flag
                // You'll need to get this data from your callback URL params or API
                const response = await axios.get<GoogleSignInResponse>(
                    `${process.env.NEXT_API_URL}/auth/google/callback`
                );
                
                const token = response.data.token;
                localStorage.setItem("token", token);
                
                // Check if this is a new user
                if (response.data.user.isNewUser) {
                    router.push("/profile");
                } else {
                    router.push("/dashboard");
                }
            } catch (err: any) {
                console.error("Google sign-in failed:", err.response?.data?.message || "Error");
                router.push("/auth");
            }
        }
    }
    
    return <AuthComponent onGoogleSignIn={onGoogleSignIn} onSignup={onSignup} onLogin={onSignin} />
}