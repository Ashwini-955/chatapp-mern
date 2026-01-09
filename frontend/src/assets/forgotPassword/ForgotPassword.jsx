import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
export default function ForgotPassword() {
  const [email, setEmail] = useState("")

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const res = await axios.post(
      "/api/auth/forgot-password",
      { email }
    )

    toast.success(res.data.message)
  } catch (error) {
    toast.error(error.response?.data?.message)
  }
}

  

  return (
    <div className="w-[420px] p-6 backdrop-blur-xl bg-white/25 rounded-2xl shadow-xl border border-white/30 text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Forgot Password 
      </h2>

      <p className="text-sm text-center mb-6 text-white/90">
        Enter your registered email to receive a reset link
      </p>

      <form onSubmit={handleSubmit}>
        <label className="block text-xl font-semibold mb-1">Email</label>
        <input
          type="email"
          required
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full mb-5 bg-white/80 text-gray-800"
        />

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold"
        >
          Send Reset Link
        </button>

        <p className="text-sm text-center mt-5">
          Remember your password?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
