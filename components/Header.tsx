import React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { BookMarkedIcon, BookOpen } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* left */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              // prefetch={false}
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Lurnex
              </span>
            </Link>

            <SearchInput />
          </div>

          {/* right */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <SignedIn>
              <nav>
                <Link
                  prefetch={false}
                  href="/my-courses"
                  className="flex space-x-2 items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors md:border md:border-border md:rounded-md md:px-4 md:py-2">
                  <BookMarkedIcon className="h-4 w-4" />
                  <span className="hidden md:block">My Courses</span>
                </Link>
              </nav>
            </SignedIn>

            <ModeToggle />

            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant={"outline"}>Sign In</Button>
              </SignInButton>
              <div className="max-sm:hidden">
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
