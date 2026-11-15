
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const PurchaseManagement = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState("");
const [selectedProduct, setSelectedProduct] = useState("");
const [quantity, setQuantity] = useState("");
const [purchasePrice, setPurchasePrice] = useState("");
const [purchaseItems, setPurchaseItems] = useState([]);


const totalAmount = purchaseItems.reduce((total, item) => total + item.subtotal,0);

//Validates the selected product, quantity and price.

const handleAddProduct = () => {
  if (!selectedProduct || !quantity || !purchasePrice) {
    alert("Please select a product and enter quantity and purchase price");
    return;
  }

  const stockQuantity = Number(quantity);
  const price = Number(purchasePrice);

  if (!Number.isInteger(stockQuantity) || stockQuantity <= 0) {
    alert("Quantity must be a positive whole number");
    return;
  }

  if (!Number.isFinite(price) || price < 0) {
    alert("Please enter a valid purchase price");
    return;
  }

  const product = products.find(
    (item) => item._id === selectedProduct
  );

  if (!product) {
    alert("Product not found");
    return;
  }

  const existingItem = purchaseItems.find(
    (item) => item.product === selectedProduct
  );

  if (existingItem) {
    alert("This product has already been added");  
    return;
  }

  //Prevents adding the same product twice.

  //Calculates the product subtotal.

  const subtotal = stockQuantity * price;

  setPurchaseItems((prev) => [
    ...prev,
    {
      product: selectedProduct,
      name: product.name,
      sku: product.sku,
      quantity: stockQuantity,
      purchasePrice: price,
      subtotal,
    },
  ]);

  setSelectedProduct("");
  setQuantity("");
  setPurchasePrice("");
};


const handleCreatePurchase = async () => {
  if (!selectedSupplier) {
    alert("Please select a supplier");
    return;
  }

  if (purchaseItems.length === 0) {
    alert("Please add at least one product");
    return;
  }

  try {
    const token = await user.getIdToken();

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/purchases`,
      {
        supplier: selectedSupplier,
        products: purchaseItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPurchases((prev) => [response.data.purchase, ...prev]);

    setSelectedSupplier("");
    setPurchaseItems([]);

    //alert("Purchase created successfully");

    toast.success("Purchase details created successfully");

  } catch (error) {
    console.error("Error creating purchase:", error);

    alert(
      error.response?.data?.message || "Failed to create purchase"
    );
  }
};

const handleUpdatePurchaseStatus = async (purchaseId, status) => {
  const action = status === "Received" ? "receive" : "cancel";

  if (!window.confirm(`Are you sure you want to ${action} this purchase?`)) {
    return;
  }

  try {
    const token = await user.getIdToken();

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/purchases/${purchaseId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPurchases((prev) =>
      prev.map((purchase) =>
        purchase._id === purchaseId
          ? response.data.purchase
          : purchase
      )
    );

    //alert(response.data.message);

    toast.success(response.data.message);

  } catch (error) {
    console.error("Error updating purchase status:", error);

    alert(
      error.response?.data?.message ||
      "Failed to update purchase status"
    );
  }
};




  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        const token = await currentUser.getIdToken();

        const [purchaseResponse, supplierResponse, productResponse] =
   await Promise.all([
     axios.get(`${import.meta.env.VITE_API_URL}/api/purchases`, 
     {
        headers:{
            Authorization:`Bearer ${token}`,
          },
     }),

     axios.get(`${import.meta.env.VITE_API_URL}/api/suppliers`, {
       headers: { Authorization: `Bearer ${token}`, },
     }),

     axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
       headers: { Authorization: `Bearer ${token}`, },
     }),
   ]);

setPurchases(purchaseResponse.data);
setSuppliers(supplierResponse.data);
setProducts(productResponse.data);


      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <Loader message="Loading Purchases..."/>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            Purchase Management
          </h1>

          {/* Purchase form and purchase history will go here */}


{/* Create Purchase Form */}
<div className="bg-white p-6 rounded-lg shadow-md mb-8">

  <h2 className="text-xl font-semibold mb-5">
    Create New Purchase
  </h2>

  {/* Select Supplier */}
  <div className="mb-5">
    <label className="block font-medium mb-2">
      Select Supplier
    </label>

    <select
      value={selectedSupplier}
      onChange={(e) => setSelectedSupplier(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2"
    >
      <option value="">Choose Supplier</option>

      {suppliers.map((supplier) => (
        <option key={supplier._id} value={supplier._id}>
          {supplier.name}
        </option>
      ))}
    </select>
  </div>

  {/* Select Product */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

    <div>
      <label className="block font-medium mb-2">
        Select Product
      </label>

      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      >
        <option value="">Choose Product</option>

        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} ({product.sku})
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block font-medium mb-2">
        Quantity
      </label>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
        placeholder="Enter quantity"
      />
    </div>

    <div>
      <label className="block font-medium mb-2">
        Purchase Price (per unit)
      </label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={purchasePrice}
        onChange={(e) => setPurchasePrice(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
        placeholder="Enter purchase price"
      />
    </div>

  </div>

<div className="flex items-center gap-4">
  <button
    type="button"
    onClick={handleAddProduct}
    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
  >
    Add Product
  </button>


  <button
    type="button"
    onClick={handleCreatePurchase}
    disabled={purchaseItems.length === 0 || !selectedSupplier}
    className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
  >
    Create Purchase
  </button>

</div>

  
  {/* Added Products */}
  {purchaseItems.length > 0 && (
    <div className="mt-6 overflow-x-auto">

      <h3 className="font-semibold mb-3">
        Products in this Purchase
      </h3>

      <table className="w-full border-collapse border border-gray-300">

        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Product</th>
            <th className="border p-3">SKU</th>
            <th className="border p-3">Quantity</th>
            <th className="border p-3">Unit Price</th>
            <th className="border p-3">Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {purchaseItems.map((item) => (
            <tr key={item.product}>
              <td className="border p-3">{item.name}</td>
              <td className="border p-3">{item.sku}</td>
              <td className="border p-3">{item.quantity}</td>
              <td className="border p-3">
                ₹{item.purchasePrice.toLocaleString("en-IN")}
              </td>
              <td className="border p-3">
                ₹{item.subtotal.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      <div className="text-right mt-4 text-lg font-bold">
        Total Amount: ₹{totalAmount.toLocaleString("en-IN")}
      </div>

    </div>
  )}
</div>


{/* Purchase History */}

<div className="bg-white p-6 rounded-lg shadow-md">

  <h2 className="text-xl font-semibold mb-5">
    Purchase History
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full border-collapse border border-gray-300">

      <thead>
        <tr className="bg-gray-100">
          <th className="border p-3">Date</th>
          <th className="border p-3">Supplier</th>
          <th className="border p-3">Products</th>
          <th className="border p-3">Total Amount</th>
          <th className="border p-3">Status</th>
          <th className="border p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {purchases.length > 0 ? (
          purchases.map((purchase) => (
            <tr key={purchase._id}>

              <td className="border p-3">
                {new Date(purchase.purchaseDate).toLocaleDateString("en-IN")}
              </td>

              <td className="border p-3">
                {purchase.supplier?.name || "N/A"}
              </td>

              <td className="border p-3">
                {purchase.products.map((item, index) => (
                  <div key={index} className="mb-1">
                    {item.product?.name || "Product"} 
                    {" "}× {item.quantity}
                  </div>
                ))}
              </td>

              <td className="border p-3">
                ₹{purchase.totalAmount.toLocaleString("en-IN")}
              </td>

              <td className="border p-3">
                {purchase.status === "Pending" && (
                  <span className="text-yellow-600 font-semibold">
                    Pending
                  </span>
                )}

                {purchase.status === "Received" && (
                  <span className="text-green-600 font-semibold">
                    Received
                  </span>
                )}

                {purchase.status === "Cancelled" && (
                  <span className="text-red-600 font-semibold">
                    Cancelled
                  </span>
                )}
              </td>

              <td className="border p-3">
                {purchase.status === "Pending" && (
                  <div className="flex flex-col gap-2">

                    <button
                      onClick={() =>
                        handleUpdatePurchaseStatus(
                          purchase._id,
                          "Received"
                        )
                      }
                      className="bg-green-600 text-white px-3 py-2 text-sm rounded-md hover:bg-green-700 whitespace-nowrap"
                    >Mark as Received</button>

                    <button
                      onClick={() =>
                        handleUpdatePurchaseStatus(
                          purchase._id,
                          "Cancelled"
                        )
                      }
                      className="bg-red-600 text-white px-3 py-2 text-sm rounded-md hover:bg-red-700 whitespace-nowrap"
                    >
                      Cancel Purchase
                    </button>

                  </div>
                )}

                {purchase.status !== "Pending" && (
                  <span className="text-gray-500">
                    No actions available
                  </span>
                )}
              </td>

            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="6"
              className="border p-5 text-center text-gray-500"
            >
              No purchase records found.
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

export default PurchaseManagement;
