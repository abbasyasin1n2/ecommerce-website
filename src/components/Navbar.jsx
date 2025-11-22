'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" className="text-xl font-bold">
              Logo
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div>
        {!session ? (
          <Button onClick={() => signIn("google")}>
            Login
          </Button>
        ) : (
          <Button variant="destructive" onClick={() => signOut()}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}

