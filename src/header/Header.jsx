import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Header = ({user}) => {

  //const username = localStorage.getItem("username");

  const navigate = useNavigate();

  const handleLogout = async () => {


    // if the backend stops or the request fails , then it will go to catch show Logour error

    try {

      localStorage.removeItem("username");
    // post with empty body

      const res = await axios.post('http://localhost:3000/api/users/signOut',
                           {},
                           {withCredentials: true,}   //tells Axios to allow cookies to be sent/received with this request.It is exactly what we want when the backend sends the JWT in an HTTP-only cookie.
                           );

      alert(JSON.stringify(res.data));

      //navigate('/login');
      window.location.href="/login";

      } catch (err) {

       console.log("Logout error:", err); 

     }
      
  }

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