import "../../app/globals.css";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [formProgress, setFormProgress] = useState(0);
  const router = useRouter();

  // Calculate form completion progress for the progress bar
  useEffect(() => {
    const requiredFields = isSignUp 
      ? [formData.name, formData.email, formData.password]
      : [formData.email, formData.password];
    
    const filledFields = requiredFields.filter(field => field.trim() !== "").length;
    const progress = Math.floor((filledFields / requiredFields.length) * 100);
    
    setFormProgress(progress);
  }, [formData, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      // Handle sign-up
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirect to home page after successful sign-up
        setIsSignUp(false);
        router.push({pathname: "/user_preferences", query: {username: formData.name, email: formData.email, password: formData.password}});
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } else {
      // Handle sign-in
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.ok) {
        router.push("/"); // Redirect to home page after successful login
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 z-0" />
      
      {/* Subtle glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-10">
        <div 
          className="h-full w-1/2 mx-auto bg-white/20 rounded-full"
          style={{
            boxShadow: "0 0 30px 5px rgba(255,255,255,0.2)"
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-20 w-full max-w-md px-6 py-12">
        {/* Logo/branding element */}
        <div className="mb-12 text-center">
          <div className="text-white text-5xl font-black inline-block p-2 mb-2">
            {isSignUp ? "Da Vinci" : "Da Vinci"}
          </div>
          <p className="text-white/70 text-lg">
            {isSignUp 
              ? "Create an account to get started" 
              : "Sign in to continue your learning journey"}
          </p>
        </div>
        
        {/* Form container */}
        <div 
          className="backdrop-blur-md bg-black/30 rounded-xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ boxShadow: "0 0 15px rgba(255,255,255,0.1)" }}
        >
          {/* Form header */}
          <div className="px-8 pt-8 pb-4">
            <h1 className="text-2xl font-medium text-white mb-1">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h1>
            <div className="h-0.5 w-12 bg-white/50 rounded-full" />
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 flex flex-col gap-6">
            {isSignUp && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/20 text-white placeholder-white/40 p-4 rounded-lg focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all duration-300"
                  required={isSignUp}
                />
              </div>
            )}
            
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/50 border border-white/20 text-white placeholder-white/40 p-4 rounded-lg focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all duration-300"
                required
              />
            </div>
            
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-black/50 border border-white/20 text-white placeholder-white/40 p-4 rounded-lg focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all duration-300"
                required
              />
            </div>
            
            {/* Error message */}
            {error && (
              <div className="py-2 px-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            {/* Progress bar - similar to loading bar */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white to-white/90 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${formProgress}%`,
                  boxShadow: "0 0 10px 1px rgba(255,255,255,0.3)" 
                }}
              >
                {/* Glowing edge */}
                <div 
                  className="absolute right-0 top-0 h-full w-2 bg-white rounded-full blur-sm"
                  style={{
                    boxShadow: "0 0 10px 2px rgba(255,255,255,0.7)"
                  }}
                />
              </div>
            </div>
            
            {/* Submit button */}
            <button 
              type="submit" 
              className="hover:cursor-pointer w-full h-14 bg-black border border-white/30 rounded-lg flex items-center justify-center text-white font-medium text-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white active:scale-95 group relative overflow-hidden mt-2"
              style={{
                boxShadow: "0 0 15px rgba(255,255,255,0.1)",
              }}
            >
              <span className="mr-2">{isSignUp ? "Sign Up" : "Sign In"}</span>
              
              {/* Arrow icon */}
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              
              {/* Bottom bar with glow */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800">
                <div 
                  className="h-full w-0 group-hover:w-full bg-gradient-to-r from-white to-white/90 rounded-full transition-all duration-500"
                  style={{ 
                    boxShadow: "0 0 5px 1px rgba(255,255,255,0.5), 0 0 14px 3px rgba(255,255,255,0.2)" 
                  }}
                >
                  {/* Glowing edge */}
                  <div 
                    className="absolute right-0 top-0 h-full w-4 bg-white rounded-full blur-sm"
                    style={{
                      boxShadow: "0 0 5px 5px rgba(255,255,255,0.7)"
                    }}
                  />
                </div>
              </div>
            </button>
          </form>
          
          {/* Form footer with toggle button */}
          <div className="border-t border-white/10 py-5 px-8 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="hover:cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}