import { Suspense } from "react";
import GoogleCallbackPage from "../../../../components/pages/callback";

export default function Page(){
    return <Suspense fallback={<div>Loading...</div>}>
        <GoogleCallbackPage/>
    </Suspense>
}