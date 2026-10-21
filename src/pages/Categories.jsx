import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Categories = () => {

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);  //This will eventually hold the categories coming from backend db i.e MongoDB.

  const [formData,setFormData] = useState({name:"",description:"",});

  const [currentPage, setCurrentPage] = useState(1);

  const categoriesPerPage = 4;

  const [searchTerm, setSearchTerm] = useState("");  //search state for category search box

  const [currentUser, setCurrentUser] = useState(null);


const fetchCategories = async (user) => {

  try {

    //The token is proof to backend that the request comes from an authenticated Firebase user.

    const token = await user.getIdToken(); 

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/categories/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("CATEGORIES API RESPONSE:", res.data);
    setCategories(res.data);
  } catch (err) {


    console.error("Category loading error:", err);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);

    toast.error(
      err.response?.data?.message || "Failed to load categories"
    );
  }
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      setCurrentUser(null);
      navigate("/login");
      return;
    }

    setCurrentUser(user); // store Firebase authenticated user in state variable so can be accessed by handleSubmit
    fetchCategories(user);
  });

  return () => unsubscribe();
}, [navigate]);



  useEffect(() => {

      setCurrentPage(1);

}, [categories,searchTerm]);  //whenever categories list changes either due to deletion or addition or search term changes page gores back to Page 1 



  const handleChange = (e) => {

  //Whatever the admin types into an input, put that value into the corresponding formData field.

  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });

};

const handleSubmit = async (e) => {

  e.preventDefault();  //prevents page refresh

  if (!currentUser) {
  toast.error("Please login first.");
  return;
}

  try {

    //send the category to backend POST /api/categories
    //backend saves it to mongoDB

    const token = await currentUser.getIdToken(); //currentUser refers to user. One of its built-in methods is getIdToken().
    


    //The method asks Firebase to provide an ID token for the currently authenticated user.

    //currentUser is a React state variable, but currentUser.getIdToken() calls a method belonging to the Firebase user object stored inside it.


    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/categories/`,   
      formData,
      {
        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );

    //add the newly created category to the page immediately

    //setCategories([...categories, response.data]);

    await fetchCategories(currentUser);

     //clear the form data

    setFormData({
      name: "",
      description: "",
    });
    
    

    toast.success("Category added successfully!");

  } catch (err) {

    toast.error(
      err.response?.data?.message || "Failed to add category"
    );

  }
  }; // closes handleSubmit

const handleDelete = async (id) => {

if (!currentUser) {
  toast.error("Please login first.");
  return;
}

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) {
    return;
  }


  try {


  const token = await currentUser.getIdToken();

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/categories/${id}`,
      {
        headers:{
          Authorization:`Bearer ${token}`,
        },
      }
    );

    await fetchCategories(currentUser);

    toast.success("Category deleted successfully!");

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Failed to delete category"
    );

  }

}




const filteredCategories = categories.filter((category) =>
  category.name.toLowerCase().includes(searchTerm.toLowerCase())
);


const totalPages = Math.ceil(
  filteredCategories.length / categoriesPerPage
);

const startIndex = (currentPage - 1) * categoriesPerPage;

const currentCategories = filteredCategories.slice(
  startIndex,
  startIndex + categoriesPerPage
);

return (
  <div className="min-h-screen flex bg-slate-100">

    <Sidebar />

    <div className="flex-1">

      <Header />

      <main className="p-6">

        <h2 className="text-2xl font-bold text-slate-700 mb-6">
          Categories
        </h2>

       <div className="bg-white rounded-lg shadow p-6">

       <input
  type="text"
  placeholder="Search categories..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="border border-gray-300 rounded-lg px-4 py-2 w-80"
/>

{/*  <h3 className="text-lg font-semibold text-slate-700 mb-4">
    Add Category
  </h3>*/}

  <form onSubmit={handleSubmit}>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <label className="block mb-1 font-medium">
          Category Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter category name"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Description
        </label>

        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter category description"
        />
      </div>

    </div>

    <button
      type="submit"
      className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
    >
      Add Category
    </button>

  </form>

  <table className="w-full border-collapse mt-8">

            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 border-b">
                  Name
                </th>

                <th className="text-left p-3 border-b">
                  Description
                </th>

                <th className="text-left p-3 border-b">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

                        {filteredCategories.length === 0 ? (

    <tr>
      <td
        colSpan="8"
        className="text-center py-6 text-gray-500"
      >
        No categories found.
      </td>
    </tr>

  ) : (

              currentCategories.map((category) => (
                <tr key={category._id}>

                  <td className="p-3 border-b">
                    {category.name}
                  </td>

                  <td className="p-3 border-b">
                    {category.description}
                  </td>

                  <td className="p-3 border-b">
  <button
    className="text-blue-600 hover:underline" onClick={()=>navigate(`/edit-category/${category._id}`)}
  >
    Edit
  </button>&nbsp;&nbsp;&nbsp;

    <button
    className="text-red-600 hover:underline" onClick={()=>handleDelete(`${category._id}`)}
  >
    Delete
  </button>
</td>

                </tr>
              ))
              )}

            </tbody>

          </table>

          {filteredCategories.length > categoriesPerPage && (
  <div className="flex justify-center items-center gap-4 p-4">

    <button
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
    >
      Previous
    </button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600">
    
      Next
    </button>

  </div>
)}

        </div>

      </main>

    </div>

  </div>
);
};


export default Categories;