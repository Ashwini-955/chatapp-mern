import React from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./components/Sidebar.jsx"
import MessageContainer from "./components/MessageContainer.jsx";
const Home = () => {
  const { authUser } = useAuth();

  return (
    <div className="h-screen w-full bg-white flex" >
      <div>
        <Sidebar/>
      </div>
      <div>
        <MessageContainer/>
      </div>
    </div>
    
  );
};

export default Home;
