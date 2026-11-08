import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import Loader from "../components/Loader";

const EditSupplier = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  //form data initial state

const [formData, setFormData] = useState({
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India", 
});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {

  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const token = await currentUser.getIdToken();

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/suppliers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

setFormData({
  name: res.data.name || "",
  contactPerson: res.data.contactPerson || "",
  email: res.data.email || "",
  phone: res.data.phone || "",
  streetAddress: res.data.streetAddress || "",
  city: res.data.city || "",
  state: res.data.state || "",
  pinCode: res.data.pinCode || "",
  country: res.data.country || "India",
});

    } catch (error) {
      toast.error("Unable to fetch supplier details.");
      navigate("/suppliers");

    } finally {
      setLoading(false);
    }

  });

  return () => unsubscribe();

}, [id, navigate]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const token = await currentUser.getIdToken();

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/suppliers/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Supplier updated successfully!");

    navigate("/suppliers");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to update supplier."
    );
  } finally {
    setSaving(false);
  }
};

return (
  <div className="min-h-screen flex bg-slate-100">

    <Sidebar />

    <div className="flex-1">
      <Header />

      <main className="p-6">

        {loading ? (
          <Loader message="Loading supplier details..." />
        ) : (

          <>
            <h2 className="text-2xl font-bold text-slate-700 mb-6">
              Edit Supplier
            </h2>

            <div className="bg-white p-6 rounded-lg shadow max-w-2xl">

              <form onSubmit={handleSubmit} className="space-y-4">

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Supplier Name
  </label>

  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-md p-2"
    placeholder="Enter supplier name"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Contact Person
  </label>

  <input
    type="text"
    name="contactPerson"
    value={formData.contactPerson}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-md p-2"
    placeholder="Enter contact person name"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Email Address
  </label>

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-md p-2"
    placeholder="Enter email address"
  />
</div>


<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Phone Number
  </label>

  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-md p-2"
    placeholder="Enter phone number"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Street Address (Optional)
  </label>
  <textarea
    name="streetAddress"
    value={formData.streetAddress}
    onChange={handleChange}
    rows="2"
    className="w-full border border-gray-300 rounded-md p-2"
    placeholder="Enter street address"
  />
</div>

<div className="flex gap-3 pt-2">
  <button
    type="submit"
    disabled={saving}
    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
  >
    {saving ? "Updating..." : "Update Supplier"}
  </button>

  <button
    type="button"
    onClick={() => navigate("/suppliers")}
    className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600"
  >
    Cancel
  </button>
</div>

              </form>

            </div>
          </>

        )}

      </main>
    </div>

  </div>
);

};

export default EditSupplier;