import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [currentChatters, setCurrentChatters] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    const fetchCurrentChatters = async () => {
      if (!authUser) return;
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/currentchatters",
          { withCredentials: true }
        );
        setCurrentChatters(response.data);
      } catch (error) {
        console.error("Failed to fetch current chatters:", error);
      }
    };
    fetchCurrentChatters();
  }, [authUser]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("Please log in to search users.");
      return;
    }
    if (!searchInput.trim()) {
      toast.info("Enter a search query.");
      return;
    }
    setLoading(true);
    try {
      const search = await axios.get(
        `http://localhost:3000/api/user/search?query=${searchInput}`,
        { withCredentials: true }
      );

      const data = search.data;
      setSearchUser(data);

      if (data.length === 0) {
        toast.info("User not found");
      }
    } catch (error) {
      
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
      } else {
        toast.error("Search failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200 flex flex-col">
      {/* Header / Search */}
      <div className="px-4 pt-4 pb-3 bg-cyan-100">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center w-full bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-cyan-400 transition"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            className="p-2 rounded-full text-cyan-600 hover:bg-cyan-100 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
            ) : (
              <FaSearch />
            )}
          </button>

        </form>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Chat/User List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {searchUser.length > 0 ? (
          searchUser.map((user) => (
            <div
              key={user._id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-cyan-50 transition ${
                selectedUser?._id === user._id ? "bg-cyan-100" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.profilepic || "https://avatar.iran.liara.run/public/boy"}
                alt={user.fullname}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800">{user.fullname}</p>
                <p className="text-sm text-gray-500 truncate">
                  {user.username}
                </p>
              </div>
            </div>
          ))
        ) : currentChatters.length > 0 ? (
          currentChatters.map((user) => (
            <div
              key={user._id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-cyan-50 transition ${
                selectedUser?._id === user._id ? "bg-cyan-100" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.profilepic || "https://avatar.iran.liara.run/public/boy"}
                alt={user.fullname}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800">{user.fullname}</p>
                <p className="text-sm text-gray-500 truncate">
                  {user.username}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No recent chats. Search for users to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
