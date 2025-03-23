"use client";

import "./globals.css";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiLogOut, FiChevronRight } from 'react-icons/fi';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 z-0" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Custom loading spinner */}
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
            <div 
              className="absolute inset-0 rounded-full border-t-2 border-white animate-spin"
              style={{
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            ></div>
            {/* Center glow */}
            <div 
              className="absolute inset-0 rounded-full flex items-center justify-center"
            >
              <div 
                className="w-2 h-2 rounded-full bg-white"
                style={{
                  boxShadow: "0 0 15px 5px rgba(255,255,255,0.7)",
                }}
              ></div>
            </div>
          </div>
          <p className="mt-6 text-white/70 text-lg">Loading your experience...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content until session is checked
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black to-gray-900 z-0" />
      
      {/* Subtle glow effect at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-1 z-10">
        <div 
          className="h-full w-1/3 mx-auto bg-white/20 rounded-full"
          style={{
            boxShadow: "0 0 30px 5px rgba(255,255,255,0.2)"
          }}
        />
      </div>
      
      <div className="relative z-20 flex flex-col min-h-screen">
        <header className="sticky top-4 mx-4 backdrop-blur-md bg-black/30 border border-white/10 text-white shadow-lg rounded-xl p-4 flex justify-between items-center"
                style={{ boxShadow: "0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.05)" }}>
          <h1 
            className="text-2xl font-bold cursor-pointer transition-all duration-300 hover:text-white/70 flex items-center"
            onClick={() => router.push("/")}
          >
            <span className="bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">DaVinci</span>
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-white/80">Welcome, {session.user?.name || "User"}!</p>
            <button
              onClick={() => signOut()}
              className="hover:cursor-pointer flex items-center gap-2 px-4 py-2 bg-black border border-white/30 text-white rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white group relative overflow-hidden"
              style={{ boxShadow: "0 0 10px rgba(255,255,255,0.05)" }}
            >
              <span className="text-sm">Log Out</span>
              <FiLogOut className="w-4 h-4" />
              
              {/* Bottom bar with glow */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800">
                <div 
                  className="h-full w-0 group-hover:w-full bg-gradient-to-r from-white to-white/90 rounded-full transition-all duration-500"
                  style={{ 
                    boxShadow: "0 0 10px 1px rgba(255,255,255,0.5), 0 0 14px 3px rgba(255,255,255,0.2)" 
                  }}
                >
                  {/* Glowing edge */}
                  <div 
                    className="absolute right-0 top-0 h-full w-4 bg-white rounded-full blur-sm"
                    style={{
                      boxShadow: "0 0 15px 5px rgba(255,255,255,0.7)"
                    }}
                  />
                </div>
              </div>
            </button>
          </div>
        </header>

        <main className="flex-grow mt-8 px-4 relative z-20">
          {children}
        </main>

        <footer className="p-6 backdrop-blur-sm bg-black/40 border-t border-white/5 text-white/60 text-center relative z-20">
          <p className="text-sm">© 2025 DaVinci. All rights reserved.</p>
        </footer>
      </div>
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