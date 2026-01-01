import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Import standard CSS

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Please login.");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup} className="auth-card">
        <h2>Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading} className="auth-button">
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <span
          onClick={() => navigate("/login")}
          className="auth-switch"
        >
          Already have an account? Login
        </span>
      </form>
    </div>
  );
}