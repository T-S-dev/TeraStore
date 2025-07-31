"use client";

import Link from "next/link";
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import ThemeToggler from "@/components/ThemeToggler";

const Header = () => {
  return (
    <header className="flex items-center justify-between border-b border-gray-300 h-16 px-6 dark:border-gray-800">
      <Link href="/" className="flex items-center space-x-2 hover:scale-[101%]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">TeraStore</h1>
      </Link>

      <div className="flex items-center space-x-2">
        <ThemeToggler />
        <SignedOut>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
