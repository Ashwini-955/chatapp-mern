import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
const Sidebar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const handleSearchSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
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
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  console.log(searchUser);
  return (
    <div className="h-screen w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200 flex flex-col">
      {/* Header / Search */}
      <div className="px-4 pt-4 pb-3">
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
          />
          <button
            type="submit"
            className="p-2 rounded-full text-cyan-600 hover:bg-cyan-100 transition"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Chat/User List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {/* Example user item */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-cyan-50 transition">
          <img
            src="https://avatar.iran.liara.run/public/boy"
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-800">John Doe</p>
            <p className="text-sm text-gray-500 truncate">
              Last message preview...
            </p>
          </div>
        </div>

        {/* Duplicate user items later via map() */}
      </div>
    </div>
  );
};

export default Sidebar;
