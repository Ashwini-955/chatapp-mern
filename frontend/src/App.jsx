import Login from "./assets/Login/Login.jsx"
import bg from "/bg.png"
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
export default function App() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Login />
      <ToastContainer/>
    </div>
  )
}
