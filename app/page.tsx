"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import homeCardContent from "@/constants/homeCardContent";

export default function Home() {
  const { isSignedIn } = useUser();
  return (
    <main className="mt-20 flex flex-1 flex-col items-center text-center">
      <h1 className="mb-4 text-[2.5rem] font-bold md:text-6xl">
        Welcome to TeraStore
      </h1>
      <h2 className="mb-8 text-lg text-gray-700 md:text-xl">
        Securely store, access, and manage your files with ease.
      </h2>

      <div>
        {isSignedIn ? (
          <Link href="/dashboard">
            <Button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <div>
            <SignInButton afterSignInUrl="/dashboard">
              <Button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button className="ml-4 rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400">
                Register
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>

      <div className="mt-16 flex min-h-60 flex-col items-center gap-8 p-4 lg:flex-row">
        {homeCardContent.map((content, index) => (
          <Card
            key={index}
            className="flex min-h-60 max-w-96 flex-col justify-between"
          >
            <CardHeader>
              <CardTitle className="mb-2">{content.title}</CardTitle>
              <CardContent>{content.content}</CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
