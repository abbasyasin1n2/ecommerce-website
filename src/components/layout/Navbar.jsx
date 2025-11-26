'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Container from "./Container";
import { useCart } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import { 
  Menu, 
  ShoppingCart, 
  User, 
  LogOut, 
  Plus, 
  Settings,
  Zap,
  Headphones,
  Camera,
  Monitor,
  Cpu,
  ChevronDown,
  Package,
  Heart
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { 
    name: "Categories", 
    href: "/products",
    dropdown: [
      { name: "Headphones", href: "/products?subcategory=Headphones", icon: Headphones },
      { name: "Cameras", href: "/products?subcategory=Camera & Photo", icon: Camera },
      { name: "Monitors", href: "/products?subcategory=Monitors", icon: Monitor },
      { name: "Computer Parts", href: "/products?subcategory=Computer Accessories & Peripherals", icon: Cpu },
      { name: "GPUs", href: "/products?subcategory=GPU", icon: Zap },
    ]
  },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Electro<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              link.dropdown ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      {link.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    {link.dropdown.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button key={link.name} variant="ghost" asChild>
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              )
            ))}
          </div>

          {/* Right Side - Auth & Cart */}
          <div className="flex items-center gap-2">
            {/* Cart Button with Sidebar */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
                      suppressHydrationWarning
                    >
                      <span suppressHydrationWarning>
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <CartSidebar onClose={() => setCartOpen(false)} />
            </Sheet>

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user?.image} alt={session.user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(session.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/add-product" className="flex items-center cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/manage-products" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Products
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile Logo */}
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 mb-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">
                      Electro<span className="text-primary">Hub</span>
                    </span>
                  </Link>

                  {/* Mobile Nav Links */}
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      link.dropdown ? (
                        <div key={link.name} className="flex flex-col gap-1">
                          <span className="px-3 py-2 text-sm font-medium text-muted-foreground">
                            {link.name}
                          </span>
                          {link.dropdown.map((item) => (
                            <Button
                              key={item.name}
                              variant="ghost"
                              className="justify-start pl-6"
                              asChild
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Link href={item.href} className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                {item.name}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <Button
                          key={link.name}
                          variant="ghost"
                          className="justify-start"
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href={link.href}>{link.name}</Link>
                        </Button>
                      )
                    ))}
                  </div>

                  {/* Mobile Auth */}
                  <div className="border-t pt-4 mt-4">
                    {session ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 px-3 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session.user?.image} alt={session.user?.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(session.user?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{session.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/dashboard">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/dashboard/add-product">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/dashboard/manage-products">
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Products
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          className="mt-2"
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)}>
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild onClick={() => setMobileMenuOpen(false)}>
                          <Link href="/login">Get Started</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </Container>
    </header>
  );
}
