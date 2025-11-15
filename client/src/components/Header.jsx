import React from "react";

const Header = () => {
  return (
    <header className="h-16 bg-secondary-700 border-b border-secondary-600 flex items-center px-6 flex-shrink-0">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center font-bold text-sm">
          D
        </div>
        <span className="ml-3 font-medium text-secondary-100">
          DWP CORPORATION
        </span>
        <span className="material-icons-outlined ml-1 text-base">
          expand_more
        </span>
      </div>
      <div className="flex-1 flex justify-center px-8">
        <div className="relative w-full max-w-md">
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
            search
          </span>
          <input
            className="w-full bg-secondary-900 border border-secondary-600 rounded-md pl-10 pr-4 py-2 text-sm text-secondary-200 placeholder:text-secondary-400 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Buscar embarques, reportes..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <img
          alt="Spanish flag"
          className="w-6 h-auto rounded-sm"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKVyLquW0pQarCnhPC8sZSANqnKSwwBeGyHuwyPa5du5lEiF4i2hqJPdHKTUSpoedE7O97Cv73S7bLp0LxFydOgF4xSdO_lSYrC0G0JoW03r-EL0MCbGAs5-EOMqOYJfQyY__3D1SWMWBXN0f0VfTNu9xL6_3F8NUCgIHOBYSRjOBMvMNiUWSCXu3KoU30MYw1JVWmjmls5d9rzNxbRdzvtPwViMXgLARnxuzAKFk-_IQrOZm83N3g56nETt4FLzrRDkVl8SBUURNn"
        />
        <button className="text-secondary-400">
          <span className="material-icons-outlined">wb_sunny</span>
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
            AP
          </div>
          <span className="ml-2 text-sm text-secondary-100">Antonio Perez</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
