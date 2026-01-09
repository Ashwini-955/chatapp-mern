import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)

  const [userInput, setUserInput] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { fullname, username, email, password, gender } = userInput

    if (!fullname || !username || !email || !password || !gender) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(
        "http://127.0.0.1:3000/api/auth/register",
        userInput
      )

      const data = res.data

      if (data.success === false) {
        toast.error(data.message)
        setLoading(false)
        return
      }

      toast.success("Registration successful")
      setLoading(false)
      navigate("/login")

    } catch (error) {
      setLoading(false)
      toast.error(error?.response?.data?.message || "Registration failed")
      console.log(error)
    }
  }

  return (
    <div className="w-[400px] backdrop-blur-xl bg-white/25 p-6 rounded-2xl shadow-xl border border-white/30 text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">Create Account</h2>

      <form onSubmit={handleSubmit}>
        <label className="block text-xl font-semibold mb-1">Full Name</label>
        <input
          id="fullname"
          type="text"
          placeholder="Enter full name"
          onChange={handleInput}
          className="input w-full mb-2 bg-white/80 text-gray-800"
        />

        <label className="block text-xl font-semibold mb-1">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Choose username"
          onChange={handleInput}
          className="input w-full mb-2 bg-white/80 text-gray-800"
        />
        <label className="block text-xl font-semibold mb-1">Gender</label>
        <select
          id="gender"
          onChange={handleInput}
          className="input w-full mb-2 bg-white/80 text-gray-800"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label className="block text-xl font-semibold mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter email"
          onChange={handleInput}
          className="input w-full mb-2 bg-white/80 text-gray-800"
        />

        <label className="block text-xl font-semibold mb-1">Password</label>
        <div className="relative mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            onChange={handleInput}
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
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
