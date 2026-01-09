import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("SENDING JSON:", JSON.stringify(userInput));

    try {
      const login = await axios.post(
        "http://127.0.0.1:3000/api/auth/login",
        userInput
      );
      const data = login.data;

      if (data.success === false) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className="w-[360px] backdrop-blur-xl bg-white/25 p-8 rounded-2xl shadow-xl border border-white/30 text-white">
      <h2 className="text-3xl font-bold mb-6">Welcome Back 👋</h2>

      <form onSubmit={handleSubmit}>
        <label className="block text-xl font-semibold mb-1">Email</label>
        <input
          id="email"
          type="email"
          required
          placeholder="Enter Email"
          onChange={handleInput}
          className="input w-full mb-4 bg-white/80 text-gray-800"
        />

        <label className="block text-xl font-semibold mb-1">Password</label>
        <div className="relative mb-6">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            onChange={handleInput}
            placeholder="Enter Password"
            className="input w-full pr-10 bg-white/80 text-gray-800"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </p>

        <p className="text-sm text-center mt-2">
          <Link to="/forgot-password" className="underline text-white">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  );
}
