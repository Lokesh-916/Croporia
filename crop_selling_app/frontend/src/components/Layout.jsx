import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sprout, Calculator, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <nav className="bg-emerald-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center font-bold text-xl tracking-wide">
                <Sprout className="mr-2 h-6 w-6" />
                Agritech
              </Link>
              <div className="ml-10 flex items-center space-x-6 overflow-x-auto">
                <Link to="/" className="flex items-center hover:bg-emerald-700 px-3 py-2 rounded-md transition-colors font-medium">
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />
                  Marketplace
                </Link>
                <Link to="/calculator" className="flex items-center hover:bg-emerald-700 px-3 py-2 rounded-md transition-colors font-medium">
                  <Calculator className="mr-1.5 h-4 w-4" />
                  Hold/Sell Calculator
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/create-listing" className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-sm">
                + New Listing
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-full p-6">
          <Outlet />
        </div>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm border-t border-slate-800">
        &copy; {new Date().getFullYear()} Agritech. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
