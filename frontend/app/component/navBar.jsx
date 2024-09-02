"use client";

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4 fixed w-full top-0 z-50 h-16 ">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-start">
            <div className="flex-shrink-0">
              <h1 className="text-white text-2xl font-normal font-mono">
                MERN-Authentication
              </h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
