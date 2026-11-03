import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Loader from "../components/Loader";

const Dashboard = () => {

const navigate = useNavigate();

const [user, setUser] = useState(null);

const [totalProducts, setTotalProducts] = useState(0); //products card count state

const [lowStockItems, setLowStockItems] = useState(0); 

const [totalCategories,setTotalCategories] = useState(0);

const [stockValue, setStockValue] = useState(0);  

const [recentProducts, setRecentProducts] = useState([]);

const [loading, setLoading] = useState(true); 

//Will hold
//AI inventory insights 
//loading status
//any error message

const [insights, setInsights] = useState("");   
const [insightsLoading, setInsightsLoading] = useState(false);
const [insightsError, setInsightsError] = useState("");


useEffect(() => {

  //The Dashboard waits for Firebase to confirm the login before requesting the user's inventory profile.

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const token = await currentUser.getIdToken();

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/currentUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
        console.log("CURRENT USER:", res.data);

      } catch (err) {
        console.error("Unable to fetch current user:", err);
        navigate("/login");
      }
    };


const fetchProducts = async (currentUser) => {

  try {
    const token = await currentUser.getIdToken();


//connect local dashboard to deployed Render Express backend

const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/products/`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


console.log("PRODUCTS API RESPONSE:", res.data);
console.log("PRODUCT COUNT:", res.data.length);

    setTotalProducts(res.data.length);

    setLowStockItems(
  res.data.filter((product) => product.quantity <= 5).length  
);


    setStockValue(
      res.data.reduce((total,product)=> total + product.quantity * product.price, 0)
      );


    setRecentProducts(res.data.slice(0,5));

  } 
  catch (err) {
    console.error("Unable to fetch products:", err);

  } 


};

 const fetchCategories = async(currentUser)=>{

    try{

      const token = await currentUser.getIdToken();

      const res = await axios.get(
`${import.meta.env.VITE_API_URL}/api/categories/`,
{
  headers: {

     Authorization: `Bearer ${token}`,

  },
}
  );

      setTotalCategories(res.data.length);


    }
    catch(err){

      console.error("Unable to fetch Categories:", err);

    }
 }

 // Promise.all waits for all three functions to finish, and finally then hides the loader

 Promise.all([
  fetchCurrentUser(),
  fetchProducts(currentUser),
  fetchCategories(currentUser),

]).finally(() => {
  setLoading(false);
});
    
  });

  return () => unsubscribe();

}, [navigate]);


//AI inventory insights

const handleGenerateInsights = async () => {
  
  setInsightsLoading(true);
  setInsightsError("");
  setInsights("");

  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please log in to generate insights.");
    }

    const token = await user.getIdToken();

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/aiassistant/insights`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setInsights(response.data.insights);

  } catch (err) {
    console.error("Inventory insights request failed:", err);

    setInsightsError(
      err.response?.data?.error ||
      err.message ||
      "Unable to generate inventory insights."
    );

  } finally {
    setInsightsLoading(false);
  }
};



  return (

    <div className="min-h-screen flex bg-slate-100">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right side */}

      {/* flex-1 takes all the remaining width after the sidebar */}

      <div className="flex-1">

        {/* Header */}
        <Header user={user} />

       
{/* Dashboard body */}
<main className="p-6">
  {loading ? (
    <Loader message="Loading dashboard..." />
  ) : (
    <>

  <h2 className="text-2xl font-bold text-slate-700 mb-6">
    Dashboard
  </h2>

  <div className="bg-white p-6 rounded-lg shadow mb-6">
    <h3 className="text-xl font-semibold mb-2">
      Welcome to your Inventory System
    </h3>

    <p className="text-gray-600">
      Manage your products, suppliers, purchases and sales
      from this dashboard.
    </p>
  </div>

  {/* Summary cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-gray-500 mb-2">Total Products</p>
      <h3 className="text-3xl font-bold text-blue-600">{totalProducts}</h3>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-gray-500 mb-2">Low Stock Items</p>
      <h3 className="text-3xl font-bold text-orange-500">{lowStockItems}</h3>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-gray-500 mb-2">Total Categories</p>
      <h3 className="text-3xl font-bold text-green-600">{totalCategories}</h3>
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-gray-500 mb-2">Stock Value</p>
      <h3 className="text-3xl font-bold text-purple-600">₹{stockValue.toLocaleString("en-IN")}</h3>
    </div>

  </div>

{/* AI Inventory Insights */}
<div className="bg-white p-6 rounded-lg shadow mt-6">

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

    <div>
      <h3 className="text-xl font-semibold text-slate-700">
        AI Inventory Insights
      </h3>

      <p className="text-gray-500 mt-1">
        Get AI-powered observations about your inventory.
      </p>
    </div>

    <button
      onClick={handleGenerateInsights}
      disabled={insightsLoading}
      className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {insightsLoading ? "Analysing..." : "Generate Insights"}
    </button>

  </div>

  {insightsLoading && (
    <p className="mt-4 text-gray-500">
      AI is analysing your inventory...
    </p>
  )}

  {insightsError && (
    <p className="mt-4 text-red-600">
      {insightsError}
    </p>
  )}

  {insights && (
    <div className="mt-4 rounded-lg bg-blue-50 p-4 text-gray-700 whitespace-pre-wrap">
      {insights}
    </div>
  )}

</div>


  

 {/* Recent Products */}
<div className="bg-white p-6 rounded-lg shadow mt-6">

  <h3 className="text-xl font-semibold text-slate-700 mb-4">
    Recent Products
  </h3>

  <div className="overflow-x-auto">
    <table className="w-full text-left">

      <thead>
        <tr className="border-b text-gray-500">
          <th className="py-3">Product Name</th>
          <th className="py-3">SKU</th>
          <th className="py-3">Quantity</th>
          <th className="py-3">Price</th>
        </tr>
      </thead>

      <tbody>
      { recentProducts.length === 0 ? (
          <tr>
            <td colSpan="4" className="py-4 text-center text-gray-500">
              No products found.
            </td>
          </tr>
        ) : ( recentProducts.map((product) => (
          <tr key={product._id} className="border-b">

            <td className="py-3"><Link onClick={()=>navigate(`/edit-product/${product._id}`)}>{product.name}</Link></td>

            <td className="py-3">{product.sku}</td>

            <td className="py-3">{product.quantity}</td>

            <td className="py-3">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </td>

          </tr>
        )))}

      </tbody>

    </table>
  </div>

</div>



    </>
  )}
</main>

      </div>

    </div>

  );
};

export default Dashboard;