import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = () => {

const navigate = useNavigate();

const [user, setUser] = useState(null);

const [totalProducts, setTotalProducts] = useState(0); //products card count state

const [lowStockItems, setLowStockItems] = useState(0); 

const [totalCategories,setTotalCategories] = useState(0);

const [stockValue, setStockValue] = useState(0);  

const [recentProducts, setRecentProducts] = useState([]);

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

        const res = await axios.get("/api/users/currentUser", {
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


    fetchCurrentUser();

    fetchProducts(currentUser);

    fetchCategories(currentUser);
    
  });

  return () => unsubscribe();

}, [navigate]);



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
        {recentProducts.map((product) => (
          <tr key={product._id} className="border-b">

            <td className="py-3"><Link onClick={()=>navigate(`/edit-product/${product._id}`)}>{product.name}</Link></td>

            <td className="py-3">{product.sku}</td>

            <td className="py-3">{product.quantity}</td>

            <td className="py-3">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </td>

          </tr>
        ))}

        {recentProducts.length === 0 && (
          <tr>
            <td colSpan="4" className="py-4 text-center text-gray-500">
              No products found.
            </td>
          </tr>
        )}
      </tbody>

    </table>
  </div>

</div>



</main>

      </div>

    </div>

  );
};

export default Dashboard;