import Login from "./assets/Login/Login.jsx"
import bg from "/bg.png"
import { ToastContainer } from "react-toastify"
import { Route, Routes } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import Register from "./register/Register.jsx"

export default function App() {
  return (
    <>
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>

      <ToastContainer />
    </>
  )
}
