// components/Header.js
import Link from "next/link";
import React from "react";
import Navbar from "../cmps/Navbar";
import ThemeSwitcher from "../cmps/ThemeSwitcher";

const Header = () => {
  return (
    <header className="py-4 bg-theme-light dark:bg-darkmode-theme-light">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">
            <span className="">Barters</span>
          </Link>
        </div>
        <Navbar />
        <ThemeSwitcher className="" />
      </div>
    </header>
  );
};

export default Header;
