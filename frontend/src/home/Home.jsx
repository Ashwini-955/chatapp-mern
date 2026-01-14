import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./components/Sidebar.jsx"
import MessageContainer from "./components/MessageContainer.jsx";
const Home = () => {
  const { authUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen w-full bg-white flex" >
      <div>
        <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      </div>
      <div className="flex-1">
        <MessageContainer selectedUser={selectedUser}/>
      </div>
    </div>
    
  );
};

export default Home;
