import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = () => {

const navigate = useNavigate();

const [user, setUser] = useState(null);


useEffect(() => {

  //The Dashboard waits for Firebase to confirm the login before requesting the user's inventory profile.

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const token = await currentUser.getIdToken();

        const res = await axios.get("/api/users/currentUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
        console.log("CURRENT USER:", res.data);
      } catch (err) {
        console.error("Unable to fetch current user:", err);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  });

  return () => unsubscribe();

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