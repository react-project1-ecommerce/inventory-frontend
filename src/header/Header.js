const Header = () => {

  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");

    // later we will also handle the JWT cookie here

      window.location.href = "/login";
      
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">

      {/* Centre */}
      <h1 className="text-xl font-bold text-slate-700">
        Inventory System
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-5">

        <span className="font-medium text-slate-700">
          {username || "User"}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Header;