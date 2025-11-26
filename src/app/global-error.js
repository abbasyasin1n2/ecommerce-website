"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-8">
          <Container className="max-w-md">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Something went wrong!</h1>
              <p className="text-gray-600 mb-8">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => reset()} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </body>
    </html>
  );
}
