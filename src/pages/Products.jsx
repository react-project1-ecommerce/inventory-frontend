import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

const Products = () => {

  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); //searchTerm will store whatever user types into the search box

  const [categoryFilter, setCategoryFilter]= useState(""); //category state for product filter

  const [categories, setCategories] = useState([]);  //category state for category search dropdown

  const [stockFilter, setStockFilter] = useState("");  

  const [currentPage, setCurrentPage] = useState(1); 

  const productsPerPage = 5;


  const navigate = useNavigate();


const filteredProducts = products.filter((product) => {

  const matchesSearch =
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(product.quantity).includes(searchTerm) ||
    String(product.price).includes(searchTerm);

  const matchesCategory =
    categoryFilter === "" ||
    product.category._id === categoryFilter;

 const matchesStock =
  stockFilter === "" ||    
  (stockFilter === "in-stock" && product.quantity > 5) ||
  (stockFilter === "low-stock" && product.quantity <= 5);

  return matchesSearch && matchesCategory && matchesStock;

});


const totalPages = Math.ceil(filteredProducts.length / productsPerPage); //Ceil rounds it UP to the next whole number

const startIndex = (currentPage - 1) * productsPerPage;

const currentProducts = filteredProducts.slice(
  startIndex,
  startIndex + productsPerPage
);





  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:3000/api/products"
      );

      setProducts(res.data);

    } catch (err) {

      console.log("Error fetching products:", err);

    }

  };

useEffect(() => {

  fetchProducts();

  const fetchCategories = async () => {

    try {

      const res = await axios.get(
        "http://localhost:3000/api/categories/"   
      );

      setCategories(res.data);

    } catch (err) {

      console.log("Error fetching categories:", err);

    }

  };

  fetchCategories();

}, []);

//So we'll automatically return to Page 1 whenever the search, category, or stock filter changes.

useEffect(()=> {

   setCurrentPage(1);

},[searchTerm,categoryFilter,stockFilter]);


  const handleDelete=async(id)=>{

    //alert("product id" + id);

      const confirmDelete = window.confirm("Are you sure you want to delete this product?");

      if (!confirmDelete) {
        return;  
        }


    try {


    await axios.delete(
      `http://localhost:3000/api/products/${id}`
    );

    setProducts(
      products.filter((product) => product._id !== id)   
    );

    
    toast.success("Product deleted successfully!", {
           autoClose: 1000,
        });


  } 
  catch (err) {

    console.log("Error deleting product:", err);

  }

  }

  return (

    <div className="min-h-screen flex bg-slate-100">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex-1">

        {/* Header */}
        <Header />

        {/* Products body */}
        <main className="p-6">

          {/* Page heading */}
          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-slate-700">
              Products
            </h2>

              <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-2 w-80"
  />


<select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  className="border border-gray-300 rounded-lg px-4 py-2"
>
  <option value="">All Categories</option>

  {categories.map((category)=>(

     <option key={category._id} value={category._id}>
       {category.name}
     </option>

    ))}
</select>

<select
  value={stockFilter}
  onChange={(e) => setStockFilter(e.target.value)}
  className="border border-gray-300 rounded-lg px-4 py-2"
>
  <option value="">All Stock</option>
  <option value="in-stock">In Stock</option>
  <option value="low-stock">Low Stock</option>
</select>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={()=>navigate('/add-product')}>
              + Add Product
            </button>

          </div>

          {/* Product table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-200">

                <tr>

                  <th className="px-4 py-3">SKU</th>

                  <th className="px-4 py-3">Product</th>

                  <th className="px-4 py-3">Category</th>

                  <th className="px-4 py-3">Quantity</th>

                  <th className="px-4 py-3">Price</th>

                  <th className="px-4 py-3">Supplier</th>

                  <th className="px-4 py-3">Department</th>

                  <th className="px-4 py-3">Actions</th>

                </tr>

              </thead>

              <tbody>

              {filteredProducts.length === 0 ? (

    <tr>
      <td
        colSpan="8"
        className="text-center py-6 text-gray-500"
      >
        No products found.
      </td>
    </tr>

  ) : (

                //display currentProducts instead of all filtered Products-> filteredProducts

                //filteredProducts.map((product) => (
                  currentProducts.map((product) => (

                  <tr
                    key={product._id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="px-4 py-3 font-medium">
                      {product.sku}
                    </td>

                    <td className="px-4 py-3">
                      {product.name}
                    </td>

                    <td className="px-4 py-3">
                      {product.category?.name}
                    </td>

                    <td className="px-4 py-3">
                      {product.quantity}
                    </td>

                    <td className="px-4 py-3">
                      ₹{product.price}
                    </td>

                    <td className="px-4 py-3">
                      {product.supplier}
                    </td>

                    <td className="px-4 py-3">
                      {product.department}
                    </td>

                    <td className="px-4 py-3">

                      <button className="text-blue-600 hover:underline mr-3" onClick={()=>navigate(`/edit-product/${product._id}`)}>
                        Edit
                      </button>

                      <button className="text-red-600 hover:underline" onClick={()=>handleDelete(product._id)}>
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

                )}

              </tbody>

            </table>

            {filteredProducts.length > productsPerPage && (

            <div className="flex justify-center items-center gap-4 p-4">

  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600">
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
  >
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

export default Products;