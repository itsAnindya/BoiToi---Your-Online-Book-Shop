// Navbar.jsx
import {
  BookOpen,
  Tag,
  Users,
  Building2,
  ShoppingCart,
  LogIn,
  Search,
  Menu
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false); // mobile menu toggle

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900 text-white shadow">
      {/* --- main row ------------------------------------------------------ */}
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* logo / brand */}
        <Link to="/" className="flex items-center gap-2">
          <BookOpen size={24} />
          <span className="text-lg font-semibold">BoiToi</span>
        </Link>

        {/* desktop menu */}
        <ul className="hidden items-center gap-6 md:flex">
          <li>
            <Link to="/books" className="flex items-center gap-1 hover:text-teal-400">
              <BookOpen size={18} /> Books
            </Link>
          </li>
          <li>
            <Link to="/genres" className="flex items-center gap-1 hover:text-teal-400">
              <Tag size={18} /> Genres
            </Link>
          </li>
          <li>
            <Link to="/authors" className="flex items-center gap-1 hover:text-teal-400">
              <Users size={18} /> Authors
            </Link>
          </li>
          <li>
            <Link to="/publishers" className="flex items-center gap-1 hover:text-teal-400">
              <Building2 size={18} /> Publishers
            </Link>
          </li>
        </ul>

        {/* right cluster – search | login | cart | hamburger */}
        <div className="flex items-center gap-4">
          {/* search (hidden on ≤lg) */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search books..."
              className="rounded-md bg-slate-800 py-1 pl-3 pr-8 text-sm placeholder-gray-400 focus:outline-none"
            />
            <Search size={16} className="absolute right-2 top-1.5" />
          </div>

          {/* login / signup */}
          <Link to="/login" className="hover:text-teal-400">
            <LogIn size={22} />
          </Link>

          {/* cart with badge */}
          <Link to="/cart" className="relative hover:text-teal-400">
            <ShoppingCart size={22} />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs">
              3
            </span>
          </Link>

          {/* hamburger for mobile */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* --- mobile dropdown ---------------------------------------------- */}
      {open && (
        <ul className="space-y-2 bg-slate-800 px-4 pb-4 pt-2 md:hidden">
          <li>
            <Link to="/books" className="flex items-center gap-2">
              <BookOpen size={18} /> Books
            </Link>
          </li>
          <li>
            <Link to="/genres" className="flex items-center gap-2">
              <Tag size={18} /> Genres
            </Link>
          </li>
          <li>
            <Link to="/authors" className="flex items-center gap-2">
              <Users size={18} /> Authors
            </Link>
          </li>
          <li>
            <Link to="/publishers" className="flex items-center gap-2">
              <Building2 size={18} /> Publishers
            </Link>
          </li>

          {/* mobile-only search */}
          <li>
            <input
              type="text"
              placeholder="Search books..."
              className="w-full rounded-md bg-slate-700 py-1 pl-3 text-sm placeholder-gray-300 focus:outline-none"
            />
          </li>
        </ul>
      )}
    </nav>
  );
}
