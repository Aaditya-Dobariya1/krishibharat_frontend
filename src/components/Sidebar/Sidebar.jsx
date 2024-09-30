import { useEffect, useRef, useState } from "react";
import {
  FiBarChart2,
  FiDollarSign,
  FiHome,
  FiMenu,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();

  const handleClickOutside = (event) => {
    if (
      isOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <FiMenu className="text-2xl" />
        </button>
      </div>

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:w-64
        bg-[#4a7c59] text-white w-64 md:w-64 shadow-lg`}
        style={{ zIndex: 9999 }}
      >
        <div className="flex flex-col h-screen">
          <div className="p-6 text-center text-xl font-semibold border-b border-green-300">
            KRISHIBHARAT
          </div>
          <nav className="flex-grow mt-8 space-y-4">
            <a
              href="#"
              className="flex items-center py-2 px-6 text-md font-medium hover:bg-[#3b634a]"
            >
              <FiHome className="mr-2" /> Dashboard
            </a>
            <a
              href="#"
              className="flex items-center py-2 px-6 text-md font-medium hover:bg-[#3b634a]"
            >
              <FiBarChart2 className="mr-2" /> Analytics
            </a>
            <a
              href="#"
              className="flex items-center py-2 px-6 text-md font-medium hover:bg-[#3b634a]"
            >
              <FiUsers className="mr-2" /> Customers
            </a>
            <a
              href="#"
              className="flex items-center py-2 px-6 text-md font-medium hover:bg-[#3b634a]"
            >
              <FiShoppingCart className="mr-2" /> Orders
            </a>
            <a
              href="#"
              className="flex items-center py-2 px-6 text-md font-medium hover:bg-[#3b634a]"
            >
              <FiDollarSign className="mr-2" /> Finance
            </a>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;