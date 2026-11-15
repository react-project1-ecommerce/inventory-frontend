
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { auth } from "../firebase";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { Country, State } from "country-state-city";

const countries = Country.getAllCountries().sort((a, b) =>
  a.name.localeCompare(b.name)
);

const AddCustomer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  });

  const [loading, setLoading] = useState(false);

  const selectedCountry = countries.find(
    (country) => country.name === formData.country
  );

  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      country: e.target.value,
      state: "",
      city: "",
      pinCode: "",
    }));
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
        `${import.meta.env.VITE_API_URL}/api/customers`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Customer added successfully!");

      navigate("/customers");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to add customer."
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
            Add Customer
          </h2>

          <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter customer name"
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
                  placeholder="Enter customer email"
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
                  placeholder="Enter customer phone number"
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
                    Country
                  </label>

                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Country</option>

                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State / Region
                  </label>

                  {states.length > 0 ? (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="">Select State / Region</option>

                      {states.map((state) => (
                        <option key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value=""
                      disabled
                      placeholder="No regions available for this country"
                      className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                    />
                  )}
                </div>

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

              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Add Customer"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/customers")}
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

export default AddCustomer;
