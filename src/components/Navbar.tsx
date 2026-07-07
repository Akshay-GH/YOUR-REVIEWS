"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { usePathname } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User; // assertion is required to access user properties
  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(pathname === "/dashboard");
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/70 text-slate-900 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:gap-6 md:px-8">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            MessageMint
          </Link>
          {session ? (
            <>
              <span className="text-sm text-slate-600">
                Welcome, {user.userName || user.email}
              </span>
              <div className="flex gap-4">
                <Button
                  className={`${isDashboard ? "hidden" : "block"} w-full md:w-auto rounded-full border-slate-300 bg-white/80 text-slate-900`}
                  variant="outline"
                >
                  <Link href="/dashboard" className="font-bold mb-4 md:mb-0">
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full md:w-auto rounded-full bg-slate-900 text-white hover:bg-slate-800"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto rounded-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
