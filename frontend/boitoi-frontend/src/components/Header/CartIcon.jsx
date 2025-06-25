import { ShoppingCart } from 'lucide-react';

// Cart Icon Component
const CartIcon = () => (
  <button className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group">
    <div className="relative w-8 h-8 flex items-center justify-center" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
      <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
        3
      </span>
    </div>
  </button>
);

export default CartIcon;