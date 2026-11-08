import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { auth } from "../firebase";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";


const AddSupplier = () => {

  const navigate = useNavigate();

  //form state variables that will hold supplier details entered by the user
const [formData, setFormData] = useState({
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",  //def
});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({...formData,
  	[name]: value,
  });

};
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const token = await currentUser.getIdToken();

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/suppliers`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Supplier added successfully!");

    navigate("/suppliers");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to add supplier."
    );
  } finally {
    setLoading(false);
  }
};


return (
  <div className="min-h-screen flex bg-slate-100">

    <Sidebar />

    <div className="flex-1">
      <Header />

      <main className="p-6">

        <h2 className="text-2xl font-bold text-slate-700 mb-6">
          Add Supplier
        </h2>

        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Form fields will go here */}

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
    placeholder="Enter supplier email"
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
    placeholder="Enter supplier phone number"
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

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      City
    </label>
    <input
      type="text"
      name="city"
      value={formData.city}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-md p-2"
      placeholder="Enter city"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      State
    </label>
    <input
      type="text"
      name="state"
      value={formData.state}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-md p-2"
      placeholder="Enter state"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      PIN Code
    </label>
    <input
      type="text"
      name="pinCode"
      value={formData.pinCode}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-md p-2"
      placeholder="Enter PIN code"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Country
    </label>
    <input
      type="text"
      name="country"
      value={formData.country}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>
</div>
<div className="flex gap-3 pt-2">

  <button
    type="submit"
    disabled={loading}
    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
  >
    {loading ? "Saving..." : "Add Supplier"}
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

      </main>
    </div>

  </div>
);


};

export default AddSupplier;