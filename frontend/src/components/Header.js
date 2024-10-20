import React, { useState } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
// import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@headlessui/react';

const Header = () => {

    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false); // Manage logout dialog visibility

    // Handle the logout action
    const handleLogout = () => {
        // Show the dialog
        setShowLogoutDialog(true);

        // Clear localStorage and navigate after 2 seconds
        setTimeout(() => {
            localStorage.removeItem('current_user_id');
            localStorage.removeItem('current_user_email');
            setShowLogoutDialog(false); // Hide dialog after logging out
            navigate('/'); // Redirect to home or login page
        }, 1200); 
    };

    return (
        <nav class="border-gray-200 px-2 m-5">
            <div class="container mx-auto flex flex-wrap items-center justify-between">
                <a href="#" class="flex">
                    <span class="self-center text-lg font-semibold whitespace-nowrap">Ret<span className="gradient-text">ai</span>n</span>
                </a>
                <div class="flex md:order-2">
                    <ul class="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
                        <li>
                            <a href="#" 
                            onClick={handleLogout}
                            class="text-gray-700 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">Logout</a>
                        </li>
                    </ul>
                </div>
                <div class="hidden md:flex justify-between items-center w-full md:w-auto md:order-1" id="mobile-menu-3">
                    <button data-collapse-toggle="mobile-menu-3" type="button" class="md:hidden text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg inline-flex items-center justify-center" aria-controls="mobile-menu-3" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                        <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
            {/* Display the Logout dialog when showLogoutDialog is true */}
            {showLogoutDialog && (
                <div className="fixed top-0 w-full bg-red-500 text-white text-center p-4 z-50 animate-slideDown">
                    Logging out... Redirecting to home page.
                </div>
            )}
        </nav>
    );
};

export default Header;
