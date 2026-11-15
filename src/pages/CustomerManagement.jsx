
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import Loader from "../components/Loader";

const CustomerManagement = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);



useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);


    try {
      const token = await currentUser.getIdToken();

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();

}, [navigate]);


  if (loading) {
    return <Loader message="Loading Customers..."/>;
  }


  return (
    <div>
      <Header user={user} />

  <div className="flex">
  <Sidebar />

  <div className="flex-1 p-6">

    <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Customer Management
          </h1>

            <button onClick={() => navigate("/add-customer")} className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
  >
    Add Customer
  </button>
  </div>


<div className="bg-white shadow-md rounded-lg p-5">

  <h2 className="text-lg font-semibold mb-4">
    Customer List
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse">

      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-3 border">Name</th>
          <th className="p-3 border">Email</th>
          <th className="p-3 border">Phone</th>
          <th className="p-3 border">City</th>
          <th className="p-3 border">Country</th>
        </tr>
      </thead>

      <tbody>
        {customers.length > 0 ? (
          customers.map((customer) => (
            <tr key={customer._id} className="hover:bg-gray-50">
              <td className="p-3 border">{customer.name}</td>
              <td className="p-3 border">{customer.email}</td>
              <td className="p-3 border">{customer.phone}</td>
              <td className="p-3 border">{customer.city}</td>
              <td className="p-3 border">{customer.country}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center p-4 border">
              No customers found.
            </td>
          </tr>
        )}
      </tbody>

    </table>
  </div>

</div>

     </div>
  </div>
</div>
);


};

export default CustomerManagement;
