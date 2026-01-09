import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const { token } = useParams()

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (password !== confirmPassword) {
    toast.error("Passwords do not match")
    return
  }

  try {
    const res = await axios.post(
      `/api/auth/reset-password/${token}`,
      { password }
    )

    toast.success(res.data.message)
    navigate("/login")

  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong")
  }
}


  return (
    <div className="w-[420px] p-6 backdrop-blur-xl bg-white/25 rounded-2xl shadow-xl border border-white/30 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Reset Password 
      </h2>

      <form onSubmit={handleSubmit}>
        <label className="block text-xl font-semibold mb-1">
          New Password
        </label>
        <input
          type="password"
          required
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
          className="input w-full mb-4 bg-white/80 text-gray-800"
        />

        <label className="block text-xl font-semibold mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          required
          placeholder="Confirm new password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input w-full mb-6 bg-white/80 text-gray-800"
        />

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold"
        >
          Reset Password
        </button>

        <p className="text-sm text-center mt-5">
          Back to{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
