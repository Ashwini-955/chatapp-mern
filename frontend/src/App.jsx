import Login from "./assets/Login/Login.jsx"
import Home from "./home/Home.jsx"
import ForgotPassword from "./assets/forgotPassword/ForgotPassword.jsx"
import bg from "/bg.png"
import { ToastContainer } from "react-toastify"
import { Route, Routes } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import Register from "./register/Register.jsx"
import ResetPassword from "./assets/resetPassword/ResetPassword.jsx"
import VerifyUser from "./utils/VerifyUser.jsx"
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
          <Route element={<VerifyUser />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />  
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          

        </Routes>
      </div>

      <ToastContainer />
    </>
  )
}
