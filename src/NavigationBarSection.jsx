import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React, { useState } from "react";
import Form from "./Form";
import axios from "axios";
import logo from "@/assets/cybermind_works_logo.jpeg";
import { config } from "./config/config";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

export default function NavigationBarSection({ onJobSubmit }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#" },
    { label: "Find Jobs", href: "#" },
    { label: "Find Talents", href: "#" },
    { label: "About us", href: "#" },
    { label: "Testimonials", href: "#" },
  ];

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleJobSubmit = async (newJob) => {
    try {
      const response = await axios.post(`${config.backend.baseUrl}/jobs`, newJob);
      const createdJob = response.data;
      onJobSubmit(createdJob);
      handleCloseForm();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <>
      <nav className="w-full h-16 md:h-20 bg-white border-b border-solid border-[#fcfcfc] shadow-sm md:shadow-[0px_0px_20px_#7f7f7f26] md:rounded-[122px] md:max-w-[890px] md:mx-auto md:my-4 px-4 md:px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="w-9 h-9 md:w-11 md:h-[45px]">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden p-2"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:block mx-4">
            <NavigationMenuList className="flex items-center gap-1 lg:gap-2">
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={item.href}
                    className="inline-flex items-center justify-center px-3 py-1 lg:px-6 lg:py-2 font-bold text-sm lg:text-base text-[#000000] rounded-[10px] hover:bg-gray-100 transition-colors"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Create Job Button */}
          <Button
            onClick={handleOpenForm}
            className="hidden md:flex px-4 py-1 lg:px-6 lg:py-2 rounded-[30px] font-bold text-sm lg:text-base text-white bg-gradient-to-b from-[#a028ff] to-[#6000ac] hover:from-[#8a20e0] hover:to-[#4d0099]"
          >
            Create Jobs
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40 p-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="px-4 py-3 font-medium text-gray-900 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button
                onClick={() => {
                  handleOpenForm();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-2 px-4 py-3 rounded-[30px] font-bold text-base text-white bg-gradient-to-b from-[#a028ff] to-[#6000ac]"
              >
                Create Jobs
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Job Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Form onClose={handleCloseForm} onJobSubmit={handleJobSubmit} />
        </div>
      )}
    </>
  );
}