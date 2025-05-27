import { useState } from "react";
import { supabase } from "~/lib/supabase";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/learn";
    } catch (err: any) {
      setError(err.message || "Email login failed.");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://minhvd-11.github.io/index-librorum/learn",
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google OAuth Error:", err);
      setError(err.message || "Google login failed.");
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "https://minhvd-11.github.io/index-librorum/learn",
        },
      });
      if (error) throw error;
      setMessage("Check your email for a login link.");
    } catch (err: any) {
      setError(err.message || "Magic link failed.");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Login
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mb-4"
        >
          Login with Email
        </button>
      </form>
      <form onSubmit={handleMagicLink}>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-1"
            htmlFor="magic-email"
          >
            Email for Magic Link
          </label>
          <input
            id="magic-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mb-4"
        >
          Sign in with Magic Link
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
};

export default Login;
