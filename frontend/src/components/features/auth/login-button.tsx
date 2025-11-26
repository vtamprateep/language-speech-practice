'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginButton() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Get initial user data
        supabase.auth.getUser().then(({ data }) => setUser(data.user));

        // Set-up listen to track when state changes
        supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );
    }, []);

    function handleLoginRedirect() {
        router.push("/auth/login");
    }

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    if (!user) {
        return (
        <button
            onClick={handleLoginRedirect}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100"
        >
            <LogIn size={18} />
            <span>Log in</span>
        </button>
        );
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100"
        >
            <LogOut size={18} />
            <span>Log out</span>
        </button>
    );
}
