"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiLogIn, FiLogOut } from 'react-icons/fi';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Layout>{children}</Layout>
        </SessionProvider>
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-4 mx-4 bg-blue-800 text-white shadow-lg rounded-lg p-6 flex justify-between items-center z-50">
        <h1
          className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition"
          onClick={() => router.push("/")}
        >
          DaVinci
        </h1>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <p className="text-sm">Welcome, {session.user?.name || "User"}!</p>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-full transition-all duration-200 border border-red-500/20"
              >
                <span className="text-sm">Log Out</span>
                <FiLogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-full transition-all duration-200 border border-blue-500/20"
            >
              <span className="text-sm">Log In</span>
              <FiLogIn className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow mt-8">{children}</main>

      {/* Footer */}
      <footer className="p-4 bg-#171717 text-center">
        <p>© 2025 DaVinci. All rights reserved.</p>
      </footer>
    </div>
  );
}
