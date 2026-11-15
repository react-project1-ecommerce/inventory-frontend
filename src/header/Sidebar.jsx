import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-slate-800 text-white p-5">

      <h2 className="text-xl font-bold mb-8">
        Inventory System
      </h2>

      <nav className="space-y-3">

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          <Link to="/categories">Categories</Link>
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          <Link to="/products">Products</Link>
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          <Link to="/stock-management">Stock Management</Link>
        </div>
        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
  <Link to="/stock-history">Stock History</Link>
</div>

         <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
             <Link to="/ai-assistant">AI Inventory Assistant</Link>
         </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          <Link to="/suppliers">Suppliers</Link>
        </div>

          <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          <Link to="/customers">Customers</Link>
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          <Link to="/purchase-management">Purchases</Link>
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          Sales
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          Reports
        </div>

      </nav>

    </div>
  );
};

export default Sidebar;