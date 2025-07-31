"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import homeCardContent from "@/constants/homeCardContent";

export default function Home() {
  return (
    <main className="mt-20 flex flex-1 flex-col items-center text-center">
      <h1 className="mb-4 text-[2.5rem] font-bold md:text-6xl">
        Welcome to TeraStore
      </h1>
      <h2 className="mb-8 text-lg text-gray-700 md:text-xl">
        Securely store, access, and manage your files with ease.
      </h2>

      <Button
        size="lg"
        asChild
        className="mt-4 h-12 bg-blue-500 px-8 text-white hover:bg-blue-600"
      >
        <Link href="/dashboard">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>

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
