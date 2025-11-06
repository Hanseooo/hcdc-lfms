"use client";

import { useState } from "react";
import SignInForm from "@/components/forms/auth/SignInForm";
import RegisterForm from "@/components/forms/auth/RegisterForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function LandingPage() {
  const [tab, setTab] = useState("signin");

  return (
    <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 ">
      {/* Left Side — Hero Image with Overlay */}
      <div className="relative flex items-center justify-center min-h-48 shadow-2xl pb-6">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/src/assets/images/hcdc-building.png')",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/80" />
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
            HCDC LOST AND FOUND{" "}
            <span className="block text-gradient-maroon text-transparent bg-clip-text">
              MANAGEMENT SYSTEM
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base max-w-md mx-auto opacity-90">
            Effortlessly report, find, and recover lost items within the campus.
          </p>
        </div>
      </div>

      {/* Right Side — Auth Tabs */}
      <div className="flex flex-col justify-center items-center p-8 bg-background text-foreground bg-linear-to-tr from-background via-foreground/10 to-background">
        <div className="w-full max-w-md space-y-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin" className="text-sm font-medium">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="text-sm font-medium">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
