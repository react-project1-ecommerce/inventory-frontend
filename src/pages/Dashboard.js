import Header from "../header/Header";
import Sidebar from "../header/Sidebar";

const Dashboard = () => {

  return (

    <div className="min-h-screen flex bg-slate-100">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right side */}

      {/* flex-1 takes all the remaining width after the sidebar */}

      <div className="flex-1">

        {/* Header */}
        <Header />

        {/* Dashboard body */}
        <main className="p-6">

          <h2 className="text-2xl font-bold text-slate-700 mb-6">
            Dashboard
          </h2>

          <div className="bg-white p-6 rounded-lg shadow">

            <h3 className="text-xl font-semibold mb-2">
              Welcome to your Inventory System
            </h3>

            <p className="text-gray-600">
              Manage your products, suppliers, purchases and sales
              from this dashboard.
            </p>

          </div>

        </main>

      </div>

    </div>

  );
};

export default Dashboard;