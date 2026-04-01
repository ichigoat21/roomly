
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const token = params.get("token");
        const isNewUser = params.get("isNewUser") === "true";

        if (!token) {
            router.replace("/auth");
            return;
        }

        localStorage.setItem("token", token);

        if (isNewUser) {
            router.replace("/profile");
        } else {
            router.replace("/dashboard");
        }
    }, []);

    return (
        <div className="h-dvh bg-[#0e0e0d] flex items-center justify-center">
            <p className="text-sm text-white/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Signing you in…
            </p>
        </div>
    );
}