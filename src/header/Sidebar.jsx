const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-slate-800 text-white p-5">

      <h2 className="text-xl font-bold mb-8">
        Inventory System
      </h2>

      <nav className="space-y-3">

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          Dashboard
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          Products
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          Suppliers
        </div>

        <div className="px-3 py-2 rounded hover:bg-slate-700 cursor-pointer">
          Purchases
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