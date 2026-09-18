import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";

const Dashboard = () => {

const navigate = useNavigate();

const [user, setUser] = useState(null);

useEffect(() => {

  const fetchCurrentUser  = async () => {

    try {

      //Browser send JWT cookie
      //authMiddleware verifies JWT

      const res= await axios.get("http://localhost:3000/api/users/currentUser",
        {
          withCredentials: true   //tells Axios to include the cookies when making this request.Without it, the browser may not send our JWT cookie to backend
        }
      );

      //if JWT is valid then remain in Dashboard

      setUser(res.data);

      console.log("CURRENT USER:", res.data);

    } 
    catch (err) {

      //if JWT is invalid redirect to login

      console.log("User is not authenticated");

      navigate("/login");

    }

  };

  fetchCurrentUser();

}, [navigate]);


  return (

    <div className="min-h-screen flex bg-slate-100">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right side */}

      {/* flex-1 takes all the remaining width after the sidebar */}

      <div className="flex-1">

        {/* Header */}
        <Header user={user} />

        {/* Dashboard body */}
        <main className="p-6">

          <h2 className="text-2xl font-bold text-slate-700 mb-6">
            Dashboard
          </h2>

          <div className="bg-white p-6 rounded-lg shadow">

            <h3 className="text-xl font-semibold mb-2">
              Welcome to your Inventory System
            </h3>

            <p className="text-gray-600">
              Manage your products, suppliers, purchases and sales
              from this dashboard.
            </p>

          </div>

        </main>

      </div>

    </div>

  );
};

export default Dashboard;