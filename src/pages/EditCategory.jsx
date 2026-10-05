import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Header from "../header/Header";
import Sidebar from "../header/Sidebar";

const EditCategory = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {

  const fetchCategory = async () => {

    try {

      const response = await axios.get(
        `http://localhost:3000/api/categories/${id}`
      );

      setFormData(response.data);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to load category"
      );

    }

  };

  fetchCategory();

}, [id]);

  const handleChange = (e) => {

  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });

};

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    await axios.put(
      `http://localhost:3000/api/categories/${id}`,
      formData
    );

    toast.success("Category updated successfully!");

    navigate("/categories");

  } catch (err) {

    setError(
      err.response?.data?.message ||
      "Failed to update category"
    );

  }

};

return (
  <div className="min-h-screen flex bg-slate-100">

    <Sidebar />

    <div className="flex-1">

      <Header />

      <main className="p-6">

        <h2 className="text-2xl font-bold text-slate-700 mb-6">
          Edit Category
        </h2>

        <div className="bg-white rounded-lg shadow p-6">

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="space-y-5">

              <div>
                <label className="block mb-1 font-medium">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                ></textarea>
              </div>

            </div>

            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Update Category
              </button>

              <button
                type="button"
                onClick={() => navigate("/categories")}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
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

export default EditCategory;