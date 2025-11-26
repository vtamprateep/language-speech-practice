'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogIn, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  function handleLoginRedirect() {
    router.push("/auth/login"); // <-- redirect to your shadcn/Supabase login page
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
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
      <User size={18} />
      <span>Log out</span>
    </button>
  );
}
