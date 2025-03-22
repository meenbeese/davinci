"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          FinLit App
        </h1>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <p className="text-sm">Welcome, {session.user?.name || "User"}!</p>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-500 underline"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="text-sm text-blue-500 underline"
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="p-4 bg-gray-100 text-center">
        <p>© 2025 FinLit App. All rights reserved.</p>
      </footer>
    </div>
  );
}
