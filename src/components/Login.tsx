import { h } from "preact";
import { useState } from "preact/hooks";
import { supabase } from "~/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: Event) => {
    e.preventDefault();
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/learn";
    } catch (err) {
      setError("Email login failed.");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://minhvd-11.github.io/index-librorum/learn",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google OAuth Error:", err);
      setError("Google login failed. Check OAuth configuration.");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Login
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleEmailLogin}>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onInput={(e) => setEmail(e.currentTarget.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mb-4"
        >
          Login with Email
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Sign in with Google
      </button>
    </div>
  );
}
