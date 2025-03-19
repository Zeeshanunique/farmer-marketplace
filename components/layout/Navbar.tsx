"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <Link href="/" className="text-xl font-bold">
          FarmConnect
        </Link>
        
        <nav className="hidden space-x-6 md:flex">
          <Link
            href="/"
            className={`text-sm ${isActive("/") ? "font-medium" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          <Link
            href="/marketplace"
            className={`text-sm ${isActive("/marketplace") ? "font-medium" : "text-muted-foreground"}`}
          >
            Marketplace
          </Link>
          <Link
            href="/about"
            className={`text-sm ${isActive("/about") ? "font-medium" : "text-muted-foreground"}`}
          >
            About
          </Link>
        </nav>
        
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                  <Avatar>
                    <AvatarFallback>
                      {userData?.fullName ? getInitials(userData.fullName) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/dashboard" className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/sign-in" passHref>
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 