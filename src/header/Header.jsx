import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Header = ({user}) => {

  //const username = localStorage.getItem("username");

  const navigate = useNavigate();

  

const handleLogout = async () => {

  try {

    await signOut(auth);
    
    //window.location.href = "/login";


    navigate("/login");

  } catch (err) {

    console.error("Logout failed:", err);
  }
};


  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">

      {/* Centre */}
      <h1 className="text-xl font-bold text-slate-700">
        Inventory System
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-5">

       <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold shadow-sm flex items-center gap-2">
       <span className="text-lg">👤</span>
        {user?.name || "User"}
       </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Header;