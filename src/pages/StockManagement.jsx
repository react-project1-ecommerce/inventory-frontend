import { useState,useEffect } from "react";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const StockManagement = () => {

  const navigate = useNavigate();
  
  const [movementType, setMovementType] = useState("in");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  useEffect(()=>{

       const unsubscribe = onAuthStateChanged(auth,(user)=>{

          if (!user)
          {
            navigate("/login");
            return;
          }

          fetchProducts(user);

       });

       return() => unsubscribe();


  },[navigate]);

  const fetchProducts = async (user) => {

    try {

      const token = await user.getIdToken();

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );

      console.log("PRODUCTS RES DATA:", res.data);

      setProducts(res.data);

    } catch (err) {

      console.log("Error fetching products:", err);

    }

  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!product || !quantity || !reason) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    const token = await user.getIdToken();

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/products/stock`,
      {
        productId: product,
        movementType,
        quantity: Number(quantity),
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //alert(res.data.message);

    setProduct("");
    setQuantity("");
    setReason("");

    await fetchProducts(user);

    toast.success("Stock updated and history recorded successfully");
    
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to update stock."
    );
  }
};


  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Header />
        
        <div className="p-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">
            Stock Management
          </h1>

          <p className="text-gray-600 mb-6">
            Record stock received or issued.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl bg-white p-6 rounded-lg shadow space-y-5"
          >
            <div>
              <label className="block mb-2 font-medium">
                Transaction Type
              </label>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="in"
                    checked={movementType === "in"}
                    onChange={(e) => setMovementType(e.target.value)}
                  />
                  Stock In
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="out"
                    checked={movementType === "out"}
                    onChange={(e) => setMovementType(e.target.value)}
                  />
                  Stock Out
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Select Product
              </label>

              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Choose a product</option>
                {products.map((product)=>(

                  <option key={product._id} value={product._id}>{product.name}
                  </option>
                  ))}
              </select>

              {product && (
               <p className="mt-2 text-sm text-gray-600">
    Current Stock:{" "}
    {products.find((item) => item._id === product)?.quantity}
  </p>
)}
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Enter quantity"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Reason
              </label>

              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Choose a reason</option>
                <option value="Supplier delivery">
                  Supplier delivery
                </option>
                <option value="Internal use">Internal use</option>
                <option value="Damaged stock">Damaged stock</option>
                <option value="Stock correction">Stock correction</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Record {movementType === "in" ? "Stock In" : "Stock Out"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
