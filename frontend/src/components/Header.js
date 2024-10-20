import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@headlessui/react';
import { IoReturnUpBack } from "react-icons/io5";
import { useLocation } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false); // Manage logout dialog visibility

    const handleBack = () => {
        if (location.pathname === '/Lecture') {
            navigate('/Home'); // If on /Course, go back to /Home
        }
    };

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
                            {(location.pathname === '/Lecture') && (
                                <div className="w-13 p-1.5  text-white transition ease-in-out rounded-md hover:bg-blue-50">
                                    <button
                                        onClick={handleBack}
                                        className="text-gray-700 transition ease-linear flex items-center no-border">
                                        <IoReturnUpBack className="text-2xl mr-1" />
                                        <span>Back</span>
                                    </button>
                                </div>
                            )}
                        </li>
                        <li>
                            <div className='flex justify-between items-center w-full md:w-auto md:order-1'>
                                <button href="#"
                                    onClick={handleLogout}
                                    class="w-full p-2 bg-blue-600 text-white transition ease-in-out rounded-md hover:bg-blue-500">Logout</button>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Conditionally render the back button */}

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
