import { h } from "preact";
import { supabase } from "~/lib/supabase";

export default function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:4321/learn" },
    });
    if (error) console.error("Login error:", error.message);
  };

  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={() => {
        console.log("Signing in with Google...");
        signInWithGoogle();
      }}
    >
      Sign in with Google
    </button>
  );
}
