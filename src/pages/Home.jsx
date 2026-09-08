import { Link } from "react-router-dom";

const Home = () => {

  return (

    <div className="min-h-screen flex flex-col">

    {/* make the page at least the height of the screen */}

      {/* Header */}
      <header className="bg-slate-900 text-white h-24 flex items-center justify-center relative">

        <h1 className="text-3xl font-bold">
          Inventory Management System
        </h1>

        
<Link
  to="/login"
  className="absolute right-8 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
>
  Login
</Link>

      </header>


      {/* Body */}


      {/* object-cover make the warehouse image fill that area without looking distorted */}

      {/* Vite serves files inside public folder directly from / so we use src=/warehouse.png */}

      <main className="flex-1">


        <img
          src="/warehouse.png"
          alt="Warehouse"
          className="w-full h-[calc(100vh-12rem)] object-cover"
        />

      </main>


      {/* Footer */}
      <footer className="bg-slate-900 text-white h-24 flex items-center justify-center">

        <p>
          © 2026 Inventory Management System, All rights reserved.
        </p>

      </footer>

    </div>
  );
};

export default Home;