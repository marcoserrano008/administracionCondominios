import React from 'react';

const Menu = () => {
  return <div className="px-2 py-3 space-y-2 font-medium text-slate-700">
    <a
      href="#"
      className="block px-3 py-2 rounded-md text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
    >
      Home
    </a>
    <a
      href="#"
      className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
    >
      Features
    </a>
    <a
      href="#"
      className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
    >
      Pricing
    </a>
    <a
      href="#"
      className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
    >
      Contact
    </a>
  </div>
}

export default Menu;