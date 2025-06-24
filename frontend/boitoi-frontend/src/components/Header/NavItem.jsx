// Navigation Item Component
const NavItem = ({ icon, text }) => (
  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group">
    <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span className="font-medium">{text}</span>
  </button>
);

export default NavItem;