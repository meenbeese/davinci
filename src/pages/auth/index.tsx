import "../../app/globals.css";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

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
        router.push("/user_preferences"); // Redirect to home page after successful sign-up
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        {isSignUp && (
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 text-blue-500 underline"
      >
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}
