import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Header from "../header/Header";
import Sidebar from "../header/Sidebar";

const EditProduct = () => {

  const { id } = useParams();
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

  const [categories, setCategories] = useState([]);  //all the categroies will be stored in categories


  const [error, setError] = useState("");

  useEffect(() => {

  const fetchProduct = async () => {

    try {

      const response = await axios.get(
        `http://localhost:3000/api/products/${id}`  //axios calls backend route  GET /api/products/:id
      );

      const product = response.data;

      setFormData({
  name: product.name,
  sku: product.sku,
  category: product.category?._id || "",
  quantity: product.quantity,
  price: product.price,
  supplier: product.supplier,
  department: product.department,
  description: product.description || "",
});
      

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to load product"
      );

    }

  };

  
  const fetchCategories = async () => {

    try {
      const response = await axios.get(
        "http://localhost:3000/api/categories/"
      );

      setCategories(response.data);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to load categories"
      );

    }
  };

  
  fetchProduct();

  fetchCategories();

}, [id]);


  const handleChange = (e) => {

   // when we edit and change the product name , this fuction updates the formData with the new value

  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });

};


const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    await axios.put(
      `http://localhost:3000/api/products/${id}`,   //router.put("/:id", updateProduct);
      formData
    );

    toast.success("Product updated successfully!");

    navigate("/products");

  } catch (err) {

    setError(
      err.response?.data?.message ||
      "Failed to update product"
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
          Edit Product
        </h2>

        <div className="bg-white rounded-lg shadow p-6">

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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

<div>
  <label className="block mb-1 font-medium">
    Category
  </label>

  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg px-3 py-2"
    required
  >
    <option value="">Select Category</option>

    {categories.map((category) => (
      <option key={category._id} value={category._id}>
        {category.name}
      </option>
    ))}
  </select>
</div>

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

            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Update Product
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

export default EditProduct;