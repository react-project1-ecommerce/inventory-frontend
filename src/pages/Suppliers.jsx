import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Suppliers = () => {

  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      if (!currentUser) {
        navigate("/login");
        return;
      }

      const fetchSuppliers = async () => {
        try {
          const token = await currentUser.getIdToken();

          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/suppliers`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setSuppliers(res.data);

        } catch (err) {
          console.error("Unable to fetch suppliers:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchSuppliers();

    });

    return () => unsubscribe();

  }, [navigate]);

  const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this supplier?"
  );

  if (!confirmDelete) return;

  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const token = await currentUser.getIdToken();

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/suppliers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSuppliers((prev) => prev.filter((supplier) => supplier._id !== id));

    toast.success("Supplier deleted successfully!");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to delete supplier."
    );
  }
};

  return (
    <div className="min-h-screen flex bg-slate-100">

      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6">

          {loading ? (
            <Loader message="Loading suppliers..." />
          ) : (

            <>
             <div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold text-slate-700">
    Suppliers
  </h2>

  <button
    onClick={() => navigate("/add-supplier")}
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
  >
    + Add Supplier
  </button>

</div>

              <div className="bg-white p-6 rounded-lg shadow">

             {suppliers.length === 0 ? (

  <p className="text-gray-500 text-center">
    No suppliers found.
  </p>

) : (

  <>
    <p className="text-gray-600 mb-4">
      Total Suppliers: {suppliers.length}
    </p>

    <div className="overflow-x-auto">

      <table className="w-full border-collapse">

 <thead>
  <tr>
    <th>Supplier Name</th>
    <th>Contact Person</th>
    <th>Email</th>
    <th>Phone</th>
    <th>City</th>
    <th>State</th>
    <th>PIN Code</th>
    <th>Country</th>
    <th>Actions</th>
  </tr>
</thead>

        <tbody>
          {suppliers.map((supplier) => (

<tbody>
  {suppliers.map((supplier) => (
    <tr key={supplier._id}>
      <td>{supplier.name}</td>
      <td>{supplier.contactPerson || "-"}</td>
      <td>{supplier.email}</td>
      <td>{supplier.phone}</td>
      <td>{supplier.city}</td>
      <td>{supplier.state}</td>
      <td>{supplier.pinCode}</td>
      <td>{supplier.country}</td>
      <td>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/edit-supplier/${supplier._id}`)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(supplier._id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

          ))}
        </tbody>

      </table>

    </div>
  </>

)}

              </div>
            </>

          )}

        </main>
      </div>

    </div>
  );
};

export default Suppliers;