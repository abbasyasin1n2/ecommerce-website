'use client';

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Package, 
  Heart,
  Menu,
  Search,
  Zap,
  Plus,
  Settings,
  LayoutList
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/products?category=Smartphones", label: "Smartphones" },
    { href: "/products?category=Laptops", label: "Laptops" },
    { href: "/products?category=Audio", label: "Audio" },
  ];

  // Links that show only when logged in (in navbar)
  const authNavLinks = [
    { href: "/dashboard/add-product", label: "Add Product", icon: Plus },
    { href: "/dashboard/manage-products", label: "My Products", icon: LayoutList },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">ElectroHub</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex" viewport={false}>
            <NavigationMenuList className="gap-1">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              {/* Add Product & Manage Products - only visible when logged in */}
              {session && authNavLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none text-primary">
                      <link.icon className="h-4 w-4 mr-1" />
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist Button */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <CartSidebar onClose={() => setIsCartOpen(false)} />
            </Sheet>

            {/* User Menu */}
            {!session ? (
              <Button onClick={() => signIn("google")} className="hidden sm:flex">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user?.image} alt={session.user?.name || "User"} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/add-product" className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/manage-products" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Products
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              {/* Mobile Menu Content */}
              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col gap-4 py-4">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-primary">ElectroHub</span>
                  </Link>
                  
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-lg font-medium rounded-md hover:bg-accent"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t pt-4 mt-4">
                    {!session ? (
                      <Button 
                        onClick={() => {
                          signIn("google");
                          setIsMobileMenuOpen(false);
                        }} 
                        className="w-full"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Sign In with Google
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 px-3 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session.user?.image} alt={session.user?.name || "User"} />
                            <AvatarFallback>
                              {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{session.user?.name}</p>
                            <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/add-product"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                          </Link>
                          <Link
                            href="/dashboard/manage-products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Products
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                          >
                            <Heart className="mr-2 h-4 w-4" />
                            Wishlist
                          </Link>
                        </div>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            signOut();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full mt-2"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

