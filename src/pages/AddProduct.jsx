import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { toast } from 'react-toastify';

const AddProduct = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
    department: "",
    description: "",
  });

  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {

  const fetchCategories = async () => {

    try {

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories/`
      );

      setCategories(response.data);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to load categories"
      );

    }
  };

  fetchCategories();
  
}, []);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        formData
      );

      setTimeout(()=>{

          toast.success("Product added successfully!");

      }, 200);

      navigate("/products");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to add product"
      );

    }

  };

  return (

    <div className="min-h-screen flex bg-slate-100">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex-1">

        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="p-6">

          <h2 className="text-2xl font-bold text-slate-700 mb-6">
            Add Product
          </h2>

          <div className="bg-white rounded-lg shadow p-6">

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Product Name */}
                <div>
                  <label className="block mb-1 font-medium">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block mb-1 font-medium">
                    SKU
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Category */}
               <div>
  <label className="block mb-1 font-medium">
    Category
  </label>

  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-lg px-3 py-2"
  >
    <option value="">Select Category</option>

    {categories.map((category) => (
      <option key={category._id} value={category._id}>
        {category.name}
      </option>
    ))}
  </select>
</div>

                {/* Quantity */}
                <div>
                  <label className="block mb-1 font-medium">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block mb-1 font-medium">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Supplier */}
                <div>
                  <label className="block mb-1 font-medium">
                    Supplier
                  </label>

                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block mb-1 font-medium">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">

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

              {/* Buttons */}
              <div className="flex gap-3 mt-6">

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Product
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
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

export default AddProduct;