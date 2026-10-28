
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import Header from "../header/Header";
import Sidebar from "../header/Sidebar";
import { auth } from "../firebase";
import Loader from "../components/Loader";

const StockHistory = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [movementFilter, setMovementFilter] = useState("all");


const filteredHistory = history.filter((entry) => {
  const search = searchTerm.trim().toLowerCase();

  const matchesSearch =
    (entry.product?.name || "").toLowerCase().includes(search) ||
    (entry.product?.sku || "").toLowerCase().includes(search);

  const matchesMovement =
    movementFilter === "all" ||
    entry.movementType === movementFilter;

  return matchesSearch && matchesMovement;
});


  const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;


useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, movementFilter]);

//select the five records for the current page
const currentRecords = filteredHistory.slice(
  indexOfFirstRecord,
  indexOfLastRecord
);

//totalPages calculates how many pages are needed
const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/stock-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHistory(res.data);

      } catch (error) {

        console.error("Failed to fetch stock history:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6">
          <h1 className="mb-6 text-2xl font-bold">
            Stock History
          </h1>

         
<div className="mb-6 flex flex-wrap gap-4">
  <input
    type="text"
    placeholder="Search by product name or SKU..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full rounded border border-gray-300 bg-white px-4 py-2 sm:w-80"
  />

  <select
    value={movementFilter}
    onChange={(e) => setMovementFilter(e.target.value)}
    className="rounded border border-gray-300 bg-white px-4 py-2"
  >
    <option value="all">All Movements</option>
    <option value="in">Stock In</option>
    <option value="out">Stock Out</option>
  </select>
</div>

          {loading ? (
            <Loader message="Loading stock history..." />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg bg-white shadow">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Previous Stock</th>
                      <th className="p-3">New Stock</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                  {history.length === 0 ? (
  <tr>
    <td colSpan="8" className="p-6 text-center text-gray-500">
      No stock history found.
    </td>
  </tr>
) : filteredHistory.length === 0 ? (
  <tr>
    <td colSpan="8" className="p-6 text-center text-gray-500">
      No matching stock history found.
    </td>
  </tr>
) : (
                      currentRecords.map((entry) => (
                        <tr
                          key={entry._id}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="p-3">
                            {entry.product?.name || "Product deleted"}
                          </td>
                          <td className="p-3">
                            {entry.product?.sku || "—"}
                          </td>
                          <td className="p-3">
                            {entry.movementType === "in"
                              ? "Stock In"
                              : "Stock Out"}
                          </td>
                          <td className="p-3">{entry.quantity}</td>
                          <td className="p-3">{entry.previousQuantity}</td>
                          <td className="p-3">{entry.newQuantity}</td>
                          <td className="p-3">{entry.reason}</td>
                          <td className="p-3">
                            {new Date(entry.createdAt).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {filteredHistory.length > recordsPerPage && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                    className="rounded bg-slate-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded bg-slate-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}


        </main>
      </div>
    </div>
  );
};

export default StockHistory;
