"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Navbar = () => {
  // const pathname = usePathname();

  // useEffect(() => {
  //   window.scroll(0, 0);
  // }, [pathname]);

  return (
    <nav className="space-x-4">
      <Link href="/" passHref>
        <span className="">Home</span>
      </Link>
      <Link href="/login" passHref>
        <span className="">Login</span>
      </Link>
      <Link href="/register" passHref>
        <span className="">Register</span>
      </Link>
    </nav>
  );
};

export default Navbar;
