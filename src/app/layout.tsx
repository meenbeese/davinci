"use client";

import "./globals.css";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiLogOut } from 'react-icons/fi';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render protected content until session is checked
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-4 mx-4 bg-white dark:bg-gray-800 text-white shadow-lg rounded-lg p-6 flex justify-between items-center z-50">
        <h1 
          className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition"
          onClick={() => router.push("/")}
        >
          DaVinci
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm">Welcome, {session.user?.name || "User"}!</p>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-800/10 hover:bg-amber-800/20 text-amber-600 rounded-full transition-all duration-200 border border-amber-800/20"
          >
            <span className="text-sm">Log Out</span>
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-grow mt-8">
        {children}
      </main>

      <footer className="p-4 bg-gray-900 text-white text-center">
        <p>© 2025 DaVinci. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <LayoutContent>{children}</LayoutContent>
        </SessionProvider>
      </body>
    </html>
  );
}
