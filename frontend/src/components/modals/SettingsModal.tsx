"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";



interface SettingsModalProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SettingsModal({ open, onOpenChange } : SettingsModalProps) {
  const [theme, setTheme] = useState("system");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-2xl w-[90vw] max-h-[85vh] overflow-y-auto rounded-xl 
          bg-linear-to-b from-[#3b0a0a]/95 to-[#1a0101]/95
          text-white border border-white/10 backdrop-blur-md p-6
          scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
        "
      >
        <DialogHeader className=" pb-4 z-10">
          <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="account" className="mt-2">
          <TabsList className="grid grid-cols-2 bg-white/10 rounded-lg p-1">
            <TabsTrigger
              value="account"
              className="text-white data-[state=active]:bg-white/20 rounded-md"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="text-white data-[state=active]:bg-white/20 rounded-md"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* ACCOUNT TAB */}
          <TabsContent value="account" className="mt-6 space-y-6">
            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-200">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    placeholder="Enter first name"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    placeholder="Enter last name"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  placeholder="Enter username"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="Enter email"
                  type="email"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input
                  placeholder="Enter contact number"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] text-white hover:opacity-90">
                  Save Profile
                </Button>
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h3 className="text-base font-semibold text-gray-200">
                Password Settings
              </h3>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] text-white hover:opacity-90">
                  Save Password
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* PREFERENCES TAB */}
          <TabsContent value="preferences" className="mt-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-gray-200 mb-2">
                Theme Preference
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Choose how you want the interface to appear.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Button
                  variant={theme === "light" ? "default" : "ghost"}
                  onClick={() => setTheme("light")}
                  className="flex-1 flex items-center gap-2 justify-center bg-white/10 hover:bg-white/20"
                >
                  <Sun className="h-4 w-4" /> Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "ghost"}
                  onClick={() => setTheme("dark")}
                  className="flex-1 flex items-center gap-2 justify-center bg-white/10 hover:bg-white/20"
                >
                  <Moon className="h-4 w-4" /> Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "ghost"}
                  onClick={() => setTheme("system")}
                  className="flex-1 flex items-center gap-2 justify-center bg-white/10 hover:bg-white/20"
                >
                  <Monitor className="h-4 w-4" /> System
                </Button>
              </div>

              <div className="pt-4">
                <Button className="w-full sm:w-auto bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] text-white hover:opacity-90">
                  Save Preference
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
